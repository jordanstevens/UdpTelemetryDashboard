//Simulate sensor telemetry and transmit it as udp packets to a Python script.
#include <WiFi.h>
#include <WiFiUdp.h>
#include "WiFiCreds.h"

const char* udpIP = "YOUR_SERVER_IP";
const int udpPort = YOUR_PORT;
WiFiUDP udp;

struct __attribute__((packed)) Data{
  uint32_t sequence;
  float voltage;
};
Data telemetry;
uint32_t seq = 0;

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  Serial.println("Connecting...");
  while(WiFi.status() != WL_CONNECTED){
    delay(500);
    Serial.print("...");
  }
  Serial.println("Connected.");
  udp.begin(udpPort);
}

void loop() {
  telemetry.sequence = ++seq;
  telemetry.voltage = random(110, 130) / 10.00;
  udp.beginPacket(udpIP, udpPort);
  udp.write((uint8_t*)&telemetry, sizeof(telemetry));
  udp.endPacket();
  delay(1000);
}
