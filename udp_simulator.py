import socket
import random
import struct
import time

UDPIP = "127.0.0.1"
UDPPORT = 7800

with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
   sequence = 0
   try:
      while True:
         sequence += 1
         temperature = random.uniform(75, 95)
         humidity = random.uniform(25, 65)
         signal = random.randint(-80, -50)
         payload = struct.pack("Iffl", sequence, temperature, humidity, signal)
         s.sendto(payload, (UDPIP, UDPPORT))
         time.sleep(1)

   except KeyboardInterrupt:
      print("Simulator closed by user.")


