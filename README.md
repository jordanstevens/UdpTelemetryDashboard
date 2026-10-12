# ESP32 Telemetry Dashboard
A real-time IoT telemetry system that collects temperature and humidity data from an ESP32 microcontroller via UDP packets and visualizes it on a web dashboard served by FastAPI. This project served as a self-directed educational excercise to gain knowledge and experience beyond what college curriculum provided.
src="https://github.com/user-attachments/assets/443cbb4d-3036-4f22-82f7-46d16995b449" />
## Data Flow
1. The ESP32 microcontroller reads environmental sensor data and transmits it over the local network as raw UDP packets.
2. An asynchronous FastAPI server hosts the static frontend files and simultaneously listens on a specific UDP port to capture incoming sensor packets.
3. The server uses a websocket to transmit parsed telemetry packets to the dashboard, which updates the display.

## Key Features
- UDP transmission ensures low latency communication and low overhead for microcontroller.
- On the backend, FastAPI asynchronously reads packets and sends parsed telemetry.
- The frontend is self-hosted with FastAPI serving the static files directly.
- WiFi signal strength, temperature, and relative humidity are charted, and summary stats displayed, in real time.
- Each chart uses range-based color coding.

## Requirements
### Hardware
- ESP-Wroom-32 microcontroller
- BME280 Temperature/Humidity/Pressure sensor
### Firmware
- Arduino IDE
- WiFi.h and WiFiUdp.h for network communication
- Wire.h for I2C
- Adafruit_Sensor.h and Adafruit_BME_280.h for reading sensor
### Backend
- Python version 3.10 or higher
- FastAPI, uvicorn
### Frontend
- HTML5, CSS3, JavaScript
- chart.js 


## Installation and Setup
### Backend
#### 1. Clone the repository and navigate to it.
```
git clone https://github.com/jordanstevens/UdpTelemetryDashboard
cd UdpTelemetryDashboard
```
#### 2. Create and activate a virtual environment.
```
python -m venv venv
.\venv\Scripts\activate
```
#### 3. Install dependencies
```
pip install -r requirements.txt
```
#### 4. Identify your local IP address.
In the upcoming steps, the microcontroller will use this address as the destination for its transmissions. This can be found by running ```ipconfig``` in the command prompt on Windows.

### Firmware

#### 1. Ensure that you have the Arduino IDE installed

#### 2. Create WiFiCreds.h file
1. Open the Arduino IDE
2. Use the library manager to install the libraries listed in the requirements section above.
3. Select "New Sketch"
4. Copy the following code and insert your own wifi credentials and address.
```
#pragma once

const char* ssid = "Your WiFi network name";
const char* password = "Your WiFi password";
const char* udpIP = "Your IP Address";
const int udpPort = "Your port number";
```
5. Save the file as ```WiFiCreds.h``` in the ```udpTel_sender``` sub-directory of the ```Arduino``` directory.

#### 3. Upload the code to the microcontroller
1. Now open the ```udpTel_sender.ino``` file found in the same directory.
2. Ensure that the BME280 sensor is connected to the microcontroller's default I2C pins ( SDA to GPIO-21 and SCL to GPIO-22 On a 30 pin ESP-Wroom-32 ), as well as 3.3V power and ground.
3. Connect your microcontroller, select its board type and COM port, and click the upload (Arrow) button.
4. Once the upload is complete, open the serial monitor of the IDE. The temperature and humidity readings should be updating to the monitor. 

## Running the System
1. Ensure that the microcontroller is connected to usb power.
2. Make sure that the virtual environment is active. ```(venv)``` should appear before the path in the command line. If it does not, navigate to the project's root folder and run ```.\venv\Scripts\activate``` in the command line.
3. Start the server by running ```fastapi telemetry_server.py```.
4. In the address bar of a browser, enter ```127.0.0.1:8000```.
5. FastAPI will serve the static files to the browser, and update the dashboard with the telemetry it receives from the microcontroller.

