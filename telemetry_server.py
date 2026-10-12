import asyncio
import struct
from contextlib import asynccontextmanager
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import uvicorn

STRUCT_FORMAT = "<Iffl"
EXPECTED_SIZE = struct.calcsize(STRUCT_FORMAT)
UDPIP = "0.0.0.0"
UDPPORT = 7800
background_tasks = set()


class ConnectionManager:
   def __init__(self):
      self.connected_sockets: dict[WebSocket, asyncio.Queue] = {}

   async def connect(self, websocket: WebSocket):
      await websocket.accept()
      self.connected_sockets[websocket] = asyncio.Queue(maxsize=30)
   
   def disconnect(self, websocket: WebSocket):
      self.connected_sockets.pop(websocket, None)

   def transmit(self, telemetry: dict):
      
      for ws, queue in list(self.connected_sockets.items()):
         try:
            queue.put_nowait(telemetry)
         except asyncio.QueueFull:
            print("evicting socket with full queue")
            try:
               asyncio.create_task(ws.close())
            except Exception:
               pass
            self.disconnect(ws)
         

class UDPProtocol(asyncio.DatagramProtocol):
   def __init__(self, transmit_tel):
      self.transmitter = transmit_tel

   def datagram_received(self, data: bytes, addr: tuple):
      if len(data) != EXPECTED_SIZE:
         return
      try:
         sequence, temperature, humidity, signal = struct.unpack(STRUCT_FORMAT, data)
         telemetry = {
            "signal": signal,
            "sequence": sequence,
            "temperature": round(temperature,2),
            "humidity": round(humidity,2),
         }
         self.transmitter(telemetry)
      except struct.error:
         print("struct error!")
         pass


manager = ConnectionManager()


@asynccontextmanager
async def lifespan(app: FastAPI):
   loop = asyncio.get_running_loop()
   transport, protocol = await loop.create_datagram_endpoint(
      lambda: UDPProtocol(transmit_tel=manager.transmit),
      local_addr = (UDPIP, UDPPORT)
   )
   yield
   transport.close()
   
app = FastAPI(lifespan=lifespan)

async def worker(websocket: WebSocket, queue: asyncio.Queue):
   while True:
      telemetry = await queue.get()
      await websocket.send_json(telemetry)
      queue.task_done()

@app.websocket("/ws")
async def websocket_route(websocket: WebSocket):
   await manager.connect(websocket)   
   socket_queue = manager.connected_sockets[websocket]
   worker_task = asyncio.create_task(worker(websocket, socket_queue))
   background_tasks.add(worker_task)
   try:
      await asyncio.gather(websocket.receive_text(), worker_task)
   except (WebSocketDisconnect, Exception) as e:
      print(f"Disconnected: {e}")
      
   finally:
      worker_task.cancel()
      background_tasks.discard(worker_task)
      manager.disconnect(websocket)
 
@app.get("/", response_class=HTMLResponse)
async def read_dashboard():
   with open("index.html", "r") as f:
      return f.read()

app.mount("/static", StaticFiles(directory="static", html=True), name="static")

if __name__ == "__main__":
  uvicorn.run("telemetry_server:app", host="127.0.0.1", port=8000, reload=False, ws_ping_interval=5, ws_ping_timeout=5)