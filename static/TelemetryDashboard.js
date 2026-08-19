
function updateClock() {
    const timeElement = document.getElementById('time');
    if (timeElement) {
        const now = new Date();
        timeElement.innerText = now.toLocaleTimeString();
    }
}

async function fetchTelemetry() {
    try {
        const response = await fetch('/api/telemetry');
        const data = await response.json();
        console.log(data);               
        document.getElementById('seq').innerText = `Packet #${data.sequence}`;
        document.getElementById('volts').innerText = `Voltage: ${data.voltage}`;
        
        const statusDiv = document.getElementById('status');
        if (data.connected) {
            statusDiv.innerText = "Connected.";
            statusDiv.style.color = "#4caf50";
        } else {
            statusDiv.innerText = "Waiting for transmission...";
            statusDiv.style.color = "#888";
        }

    } catch (error) {
        console.error("Failed to fetch telemetry data:", error);
        const statusDiv = document.getElementById('status');
        if (statusDiv) {
            statusDiv.innerText = "Server Connection Lost.";
            statusDiv.style.color = "#ff9800";
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    updateClock();
    fetchTelemetry();             
    setInterval(updateClock, 1000);     // Clock ticks every 1000ms
    setInterval(fetchTelemetry, 1000); // Telemetry fetches every 1000ms
});
