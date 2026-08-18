import socket
import struct

STRUCT_FORMAT = "<If"
EXPECTED_SIZE = struct.calcsize(STRUCT_FORMAT)
UDPIP = "0.0.0.0"
UDPPORT = YOUR_PORT

def main():
   udp_sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
   udp_sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
   udp_sock.bind((UDPIP,UDPPORT))
   while True:
      print(f"Listening for udp transmission")
      data, address = udp_sock.recvfrom(1024)
      if len(data) != EXPECTED_SIZE:
         continue
      sequence, voltage = struct.unpack(STRUCT_FORMAT, data)
      print(f'Sequence # {sequence}')
      print(f'Voltage: {round(voltage,2)}')

   
if __name__ == "__main__":
   main()

