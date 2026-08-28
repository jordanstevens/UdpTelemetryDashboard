//Simulate sensor telemetry and transmit it as udp packets to a Python script.
#include <WiFi.h>
#include <WiFiUdp.h>
#include <Wire.h>
#include <Adafruit_Sensor.h>
#include <Adafruit_BME280.h>
#include "WiFiCreds.h"


const int ambientPa = 101975;
WiFiUDP udp;
Adafruit_BME280 bme;

struct __attribute__((packed)) Data{
  uint32_t sequence;
  float temperature;
  float humidity;
  long signalStrength;
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
  bme.begin(0x76);
}

void loop() {
  Serial.print("Temp: ");
  float temp = bme.readTemperature();
  float tempF = ((temp * 1.8) + 32);
  Serial.print(tempF);
  Serial.println(" F");

  Serial.print("Humidity: ");
  Serial.print(bme.readHumidity());
  Serial.println("%");

  long signal = WiFi.RSSI();
  telemetry.sequence = ++seq;
  telemetry.temperature = tempF;
  telemetry.humidity = bme.readHumidity();
  telemetry.signalStrength = signal;
  udp.beginPacket(udpIP, udpPort);
  udp.write((uint8_t*)&telemetry, sizeof(telemetry));
  udp.endPacket();
  delay(1000);
}
