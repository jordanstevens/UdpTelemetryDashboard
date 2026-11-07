
# ESP32 Telemetry Dashboard
A real-time IoT telemetry system that collects temperature and humidity data from an ESP32 microcontroller via UDP packets and visualizes it on a web dashboard served by FastAPI. This project served as a self-directed educational exercise to gain knowledge and experience beyond what a college curriculum provided.

<img width="3837" height="1656" alt="Telemetry Dashboard 2" src="https://github.com/user-attachments/assets/0bebfed2-29a5-41f6-9800-c68059927825" />

## Data Flow
1. The ESP32 microcontroller reads environmental sensor data and transmits it over the local network as raw UDP packets.
2. An asynchronous FastAPI server hosts the static frontend files and simultaneously listens on a specific UDP port to capture incoming sensor packets.
3. The server uses a websocket to transmit parsed telemetry packets to the dashboard, which updates the display.

## Key Features
- **Low Overhead:** UDP transmission ensures low latency communication and minimal overhead for the microcontroller.
- **Asynchronous Backend:** FastAPI asynchronously reads packets and streams parsed telemetry efficiently.
- **Self-Hosted Frontend:** FastAPI serves static assets directly, minimizing dependencies.
- **Real-Time Analytics:** WiFi signal strength, temperature, and relative humidity are charted dynamically alongside live summary stats.
- **Visual Thresholds:** Each chart uses range-based color coding to indicate state changes instantly.

## Requirements

> 💡 **No Hardware? No Problem!**
> The `udp_simulator.py` script has been included to stream mock telemetry data to the server over your local network stack. You can fully experience and test this entire system without an ESP32.

### Hardware (Optional)
- ESP-Wroom-32 microcontroller
- BME280 Temperature/Humidity/Pressure sensor

### Firmware (Optional)
- Arduino IDE
- `WiFi.h` and `WiFiUdp.h` for network communication
- `Wire.h` for I2C
- `Adafruit_Sensor.h` and `Adafruit_BME280.h` for reading the sensor

### Backend
- Python version 3.10 or higher
- FastAPI, uvicorn

### Frontend
- HTML5, CSS3, JavaScript
- chart.js 

## Installation and Setup

### Backend
#### 1. Clone the repository and navigate to it.
```bash
git clone https://github.com
cd UdpTelemetryDashboard
```

#### 2. Create and activate a virtual environment.
```bash
python -m venv venv
.\venv\Scripts\activate
```

#### 3. Install dependencies
```bash
pip install -r requirements.txt
```

#### 4. Identify your local IP address.
In the upcoming steps, the microcontroller will use this address as the destination for its transmissions. This can be found by running `ipconfig` in the command prompt on Windows.

### Firmware (Optional)

#### 1. Ensure that you have the Arduino IDE installed.

#### 2. Create WiFiCreds.h file
1. Open the Arduino IDE.
2. Use the library manager to install the libraries listed in the requirements section above.
3. Select "New Sketch".
4. Copy the following code and insert your own Wi-Fi credentials and local IP address.
```cpp
#pragma once

const char* ssid = "Your WiFi network name";
const char* password = "Your WiFi password";
const char* udpIP = "Your IP Address";
const int udpPort = 5005; // Enter your target UDP port number here
```
5. Save the file as `WiFiCreds.h` in the `udpTel_sender` sub-directory of the `Arduino` directory.

#### 3. Upload the code to the microcontroller
1. Open the `udpTel_sender.ino` file found in the same directory.
2. Ensure that the BME280 sensor is connected to the microcontroller's default I2C pins (SDA to GPIO-21 and SCL to GPIO-22 on a 30-pin ESP-Wroom-32), as well as 3.3V power and ground.
3. Connect your microcontroller, select its board type and COM port, and click the upload (Arrow) button.
4. Once the upload is complete, open the serial monitor of the IDE. The temperature and humidity readings should be updating to the monitor. 

## Running the System

### Option A: Testing with the Simulator (No Hardware Required)
1. Ensure your virtual environment is active in your terminal (`(venv)` should appear before the prompt). If not, run `.\venv\Scripts\activate`.
2. Start the FastAPI backend server:
   ```bash
   python telemetry_server.py
   ```
3. Open a **second terminal window** and run the simulator script (it uses native Python libraries, so no virtual environment activation is required here):
   ```bash
   python udp_simulator.py
   ```
4. Open your web browser and navigate to `http://127.0.0.1:8000`.
5. The simulator will generate varying values packed as a binary C-struct over loopback to showcase how the dashboard charts dynamically react to shifting telemetry streams.

### Option B: Running with Physical Microcontroller Hardware
1. Ensure that the microcontroller is connected to USB power.
2. Make sure that the virtual environment is active in your terminal. If not, run `.\venv\Scripts\activate`.
3. Start the server by running:
   ```bash
   python telemetry_server.py
   ```
4. Open your web browser and navigate to `http://127.0.0.1:8000`.
5. FastAPI will serve the static files to the browser and seamlessly update the UI using live telemetry pushed directly from the ESP32 over the network stack.
