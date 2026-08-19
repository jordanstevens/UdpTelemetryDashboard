import asyncio
import struct
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
import uvicorn

STRUCT_FORMAT = "<If"
EXPECTED_SIZE = struct.calcsize(STRUCT_FORMAT)
UDPIP = "0.0.0.0"
UDPPORT = YOUR_PORT


class myProtocol(asyncio.DatagramProtocol):
   def __init__(self, app_state: dict):
      self.app_state = app_state

   def datagram_received(self, data: bytes, addr: tuple):
      if len(data) != EXPECTED_SIZE:
         return
      try:
         sequence, voltage = struct.unpack(STRUCT_FORMAT, data)
         self.app_state.clear()
         self.app_state.update({
            "sequence": sequence,
            "voltage": round(voltage,2),
            "connected": True
         })
      except struct.error:
         print("struct error!")
         pass


latest_telemetry = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
   loop = asyncio.get_running_loop()
   transport, protocol = await loop.create_datagram_endpoint(
      lambda: myProtocol(latest_telemetry),
      local_addr = (UDPIP, UDPPORT)
   )
   yield
   transport.close()

app = FastAPI(lifespan=lifespan)

@app.get("/api/telemetry")
async def get_telemetry():  
   return latest_telemetry

@app.get("/", response_class=HTMLResponse)
async def read_dashboard():
   with open("index.html", "r") as f:
      return f.read()

app.mount("/static", StaticFiles(directory="static", html=True), name="static")

if __name__ == "__main__":
  uvicorn.run("telemetry_server:app", host="127.0.0.1", port=8000, reload=False)