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

class ConnectionManager:
   def __init__(self):
      self.connected_socket: WebSocket | None = None

   async def connect(self, websocket: WebSocket):
      await websocket.accept()
      self.connected_socket = websocket

   def disconnect(self, websocket: WebSocket):
      if self.connected_socket == websocket:
         self.connected_socket = None

   async def transmit_telemetry(self, telemetry: dict):
      if self.connected_socket:
         try:
            await self.connected_socket.send_json(telemetry)
         except:
            self.connected_socket = None

class UDPProtocol(asyncio.DatagramProtocol):
   def __init__(self, transmitter_call):
      self.transmit = transmitter_call

   def datagram_received(self, data: bytes, addr: tuple):
      if len(data) != EXPECTED_SIZE:
         return
      try:
         sequence, temperature, humidity, signal = struct.unpack(STRUCT_FORMAT, data)
         
         telemetry = {
            "type": "telemetry",
            "signal": signal,
            "sequence": sequence,
            "temperature": round(temperature,2),
            "humidity": round(humidity,2),
            "connected": True
         }
         asyncio.create_task(self.transmit(telemetry))

      except struct.error:
         print("struct error!")
         pass

connection = ConnectionManager()

@asynccontextmanager
async def lifespan(app: FastAPI):
   loop = asyncio.get_running_loop()
   transport, protocol = await loop.create_datagram_endpoint(
      lambda: UDPProtocol(transmitter_call=connection.transmit_telemetry),
      local_addr = (UDPIP, UDPPORT)
   )
   yield
   transport.close()
      
app = FastAPI(lifespan=lifespan)

@app.websocket("/ws")
async def websocket_route(websocket: WebSocket):
   await connection.connect(websocket)

   try:
      while True:
         await websocket.send_json({"type": "ping"})
         await asyncio.sleep(1)

   except WebSocketDisconnect:
      connection.disconnect(websocket)


@app.get("/", response_class=HTMLResponse)
async def read_dashboard():
   with open("index.html", "r") as f:
      return f.read()

app.mount("/static", StaticFiles(directory="static", html=True), name="static")

if __name__ == "__main__":
  uvicorn.run("telemetry_server:app", host="127.0.0.1", port=8000, reload=False)