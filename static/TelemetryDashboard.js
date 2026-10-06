
const stats = {
    signal: {min: 0, max: 0, avg: 0, sum: 0, count: 0},
    temperature: {min: 0, max: 0, avg: 0, sum: 0, count: 0},
    humidity: {min: 0, max: 0, avg: 0, sum: 0, count: 0},    
}
const signal_ctx = document.getElementById('signal_chart').getContext('2d');
const temp_ctx = document.getElementById('temperature_chart').getContext('2d');
const hum_ctx = document.getElementById('humidity_chart').getContext('2d');
Chart.defaults.color = 'rgb(255,255,255)';

const signal_chart = new Chart(signal_ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: [],
            data: [],
            borderWidth: 1,
            borderColor: 'rgb(255,255,255)',
            backgroundColor: 'rgb(164, 164, 161)',
            fill: false,
            pointRadius: 5,
            pointBackgroundColor: function(context){
                const index = context.dataIndex;
                const value = context.dataset.data[index];
                if(value >= -55) return '#4caf50';
                if(value >= -70) return '#ff9800';
                if(value < -80) return '#FF0000'; 
            }
        }]
    },
    options: {
        responsive: true,
        animation: false,
        normalized: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                bottom: 40,
                right: 30,
            }
        },
        plugins: {           
            legend: {
                labels: {
                    boxWidth: 0
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgb(114, 113, 101)'
                },
                ticks: {
                    color: 'rgb(36, 84, 212)'
                }
            },
            y: {
                title: {display: true, text: 'dBm'},
                grid: {
                    color: 'rgb(114, 113, 101)'
                },
                suggestedMin: -100,
                suggestedMax: -10
            }
        }
    }
})
const temp_chart = new Chart(temp_ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: [],
            data: [],
            borderWidth: 1,
            borderColor: 'rgb(255,255,255)',
            pointBackgroundColor: function(context){
                const index = context.dataIndex;
                const value = context.dataset.data[index];
                if(value <= 82) return '#4caf50';
                if(value <= 87) return '#ff9800';
                else return '#FF0000'; 
            },
            fill: false,
            pointRadius: 5
        }]
    },
    options: {
        responsive: true,
        animation: false,
        normalized: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                bottom: 40,
                right: 30
            }
        },
        plugins: {
            legend: {
                labels: {
                    boxWidth: 0
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgb(114, 113, 101)'
                },
                ticks: {
                    color: 'rgb(36, 84, 212)'
                }
            },
            y: {
                title: {display: true, text: '°F'},
                grid: {
                    color: 'rgb(114, 113, 101)'
                },
                suggestedMin: 70,
                suggestedMax: 100
            }
        }
    }
})
const humidity_chart = new Chart(hum_ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: [],
            data: [],
            borderWidth: 1,
            borderColor: 'rgb(255,255,255)',
            pointBackgroundColor: function(context){
                const index = context.dataIndex;
                const value = context.dataset.data[index];
                if(value < 30) return '#FF0000';
                if(value < 40) return '#ff9800';
                if(value < 50) return '#4caf50';
                if(value < 60) return '#ff9800';
                else return '#FF0000';
            },
            fill: false,
            pointRadius: 5
        }]
    },
    options: {
        responsive: true,
        animation: false,
        normalized: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                bottom: 40,
                right: 30
            }
        },
        plugins: {
            legend: {
                labels: {
                    boxWidth: 0
                }
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgb(114, 113, 101)'
                },
                ticks: {
                    color: 'rgb(36, 84, 212)'
                }
            },
            y: {
                title: {display: true, text: '%'},
                grid: {
                    color: 'rgb(114, 113, 101)'
                },
                suggestedMin: 0,
                suggestedMax: 100
            }
        }
    }
})

async function updateCharts(sequence, signal, temperature, humidity){
    const MAX_TICKS = 4;

    signal_chart.data.labels.push(sequence);
    signal_chart.data.datasets[0].data.push(`${signal}`);
    if(signal_chart.data.labels.length > MAX_TICKS){
        signal_chart.data.labels.shift();
        signal_chart.data.datasets[0].data.shift();
    }
    signal_chart.update('none');

    temp_chart.data.labels.push(sequence);
    temp_chart.data.datasets[0].data.push(temperature);
    if(temp_chart.data.labels.length > MAX_TICKS){
        temp_chart.data.labels.shift();
        temp_chart.data.datasets[0].data.shift();
    }
    temp_chart.update('none');
   
    humidity_chart.data.labels.push(sequence);
    humidity_chart.data.datasets[0].data.push(humidity);
    if(humidity_chart.data.labels.length > MAX_TICKS){
        humidity_chart.data.labels.shift();
        humidity_chart.data.datasets[0].data.shift();
    }
    humidity_chart.update('none');
}

function updateClock() {
    const timeElement = document.getElementById('time');
    if (timeElement){
        const now = new Date();
        timeElement.innerText = now.toLocaleTimeString();
    }
}

async function updateStats(sig, temp, hum){ 
    const signals = stats["signal"];
    const temps = stats["temperature"];
    const hums = stats["humidity"];
    if (stats.signal.count == 0){
        signals.min = sig;
        signals.max = sig;
        signals.sum = sig;
        signals.count ++;

        temps.min = temp;
        temps.max = temp;
        temps.sum = temp;
        temps.count ++;

        hums.min = hum;
        hums.max = hum;
        hums.sum = hum;
        hums.count ++;
    }
    else{
        if(stats.signal.min > sig){
            stats.signal.min = sig;
        }
        if(sig > stats.signal.max){
            stats.signal.max = sig;
        }
        stats.signal.sum += sig;
        stats.signal.count += 1;
        stats.signal.avg = (stats.signal.sum / stats.signal.count).toFixed(2);

        if(stats.temperature.min > temp){
            stats.temperature.min = temp;
        }
        if(temp > stats.temperature.max){
            stats.temperature.max = temp;
        }
        stats.temperature.sum += temp;
        stats.temperature.count += 1;
        stats.temperature.avg = (stats.temperature.sum / stats.temperature.count).toFixed(2);

        if(stats.humidity.min > hum){stats.humidity.min = hum}
        if(hum > stats.humidity.max){stats.humidity.max = hum}
        stats.humidity.sum += hum;
        stats.humidity.count += 1;
        stats.humidity.avg = (stats.humidity.sum / stats.humidity.count).toFixed(2);
    }
}

async function viewStats(){
    document.getElementById('signal_min').innerText = `Low: ${stats.signal.min.toFixed(2)}`;
    document.getElementById('signal_max').innerText = `High: ${stats.signal.max.toFixed(2)}`;
    document.getElementById('signal_avg').innerText = `Avg: ${stats.signal.avg}`;
    
    document.getElementById('temperature_min').innerText = `Low: ${stats.temperature.min.toFixed(2)}`;
    document.getElementById('temperature_max').innerText = `High: ${stats.temperature.max.toFixed(2)}`;
    document.getElementById('temperature_avg').innerText = `Avg: ${stats.temperature.max.toFixed(2)}`;

    document.getElementById('humidity_min').innerText = `Low: ${stats.humidity.min.toFixed(2)}`;
    document.getElementById('humidity_max').innerText = `High: ${stats.humidity.max.toFixed(2)}`;
    document.getElementById('humidity_avg').innerText = `Avg: ${stats.humidity.max.toFixed(2)}`;
}

function processTelemetry(data) {
    // try {       
        const signalSpan = document.getElementById('signal');
        const tempSpan = document.getElementById('temperature');
        const humSpan = document.getElementById('humidity');
        // const statusDiv = document.getElementById('status');
        
        document.getElementById('seq').innerText = `Packet: ${data.sequence ? data.sequence : "___"}`;

        signalSpan.innerText = `Signal Strength: ${data.signal ? data.signal : "___"} dBm`;
        if(data.signal >= -55){
            signalSpan.style.color = "#4caf50";
        }
        else if(data.signal > -70 && data.signal < -55){
            signalSpan.style.color = "#ff9800";
        }
        else if(data.signal < -80){
            signalSpan.style.color = "#FF0000";
        }
        
        tempSpan.innerText = `Temperature: ${data.temperature ? data.temperature.toFixed(2) : "___"} °F`;
        if(data.temperature > 87){
            tempSpan.style.color = "#FF0000";
        }
        else if(data.temperature > 82){
            tempSpan.style.color = "#ff9800";
        }
        else{
            tempSpan.style.color = "#4caf50";
        }
       
        humSpan.innerText = `Relative Humidity: ${data.humidity ? data.humidity.toFixed(2) : "___"} %`;
        if(data.humidity < 30){
            humSpan.style.color = "#FF0000";
        }
        else if(data.humidity < 40){
            humSpan.style.color = "#ff9800";
        }
        else if(data.humidity < 50){
            humSpan.style.color = "#4caf50"
        }
        else if(data.humidity < 60){
            humSpan.style.color = "#ff9800";
        }
        else{
            humSpan.style.color = "#FF0000";
        }

        // if (data.connected) {
        //     statusDiv.innerText = "Connection OK";
        //     statusDiv.style.color = "#4caf50";
        // } else {
        //     statusDiv.innerText = "Waiting for transmission...";
        //     statusDiv.style.color = "#888";
        // }

        
        updateStats(data.signal, data.temperature, data.humidity);
        updateCharts(data.sequence, data.signal, data.temperature, data.humidity);
        viewStats();

    // } catch (error) {
    //     console.error("Failed to fetch telemetry data:", error);
    //     const statusDiv = document.getElementById('status');
    //     if (statusDiv) {
    //         statusDiv.innerText = "Server Connection Lost.";
    //         statusDiv.style.color = "#ff9800";
    //     }
    // }
}

class ConnectionManager{
    lastPing = 0;
    currentPing = 0;
    intervalID = 0;
    statusDiv = document.getElementById('status');
    
    onOpen = () => {
        this.updateConnectionStatus("open");
    };

    onMessage = (event) => {
        try{
            const message = JSON.parse(event.data);
            if(message.type == "telemetry"){
                processTelemetry(message);
            }
            else {
                if(this.lastPing == 0){
                    console.log("Starting Heartbeat.")
                    this.startHeartbeat();                           
                }
                this.lastPing = Date.now();
            }            
        }
        catch(error){
            console.log("Parsing Error: ", error);
        }
    };

    onClose = (event) => {
        this.updateConnectionStatus("disconnected");
        console.log("Disconnected. Cleaning up.");
        this.cleanup();
    };

    onError = (error) => {
        console.error("Websocket Error: ", (error));
    };

    connect(){        
        this.socket = new WebSocket(`ws://${window.location.host}/ws`);
        this.socket.addEventListener("open", this.onOpen);
        this.socket.addEventListener("message", this.onMessage);
        this.socket.addEventListener("close", this.onClose);
        this.socket.addEventListener("error", this.onError);
    }

    startHeartbeat(){
        this.lastPing = Date.now();
        this.updateConnectionStatus("connected");
        this.intervalID = setInterval(()=>{
            this.manageHeartbeat();
        }, 1000);                 
    }

    manageHeartbeat(){
        this.currentPing = Date.now();        
        let pingDifference = this.currentPing - this.lastPing;
        if(pingDifference >= 2000){
            this.updateConnectionStatus("disconnected");
            console.log("Server Ping Not Detected.");
            return;
        }
        console.log(`Time Since Last Heartbeat: ${pingDifference}`);
    }
    
    updateConnectionStatus(connectionStatus){
        switch(connectionStatus){
            case "open":
                this.statusDiv.innerText = "Waiting for transmission...";
                this.statusDiv.style.color = "#888";
                break;

            case "connected":
                this.statusDiv.innerText = "Connection OK";
                this.statusDiv.style.color = "#4caf50";
                break;
            
            case "disconnected":
                this.statusDiv.innerText = "Server Connection Lost.";
                this.statusDiv.style.color = "#ff9800";
                break;
        }
    }

    cleanup(){
        this.lastPing = 0;
        clearInterval(this.intervalID);
        this.socket.removeEventListener("open", this.onOpen);
        this.socket.removeEventListener("message", this.onMessage);
        this.socket.removeEventListener("close", this.onClose);
        this.socket.removeEventListener("error", this.onError);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    updateClock();
    const connection = new ConnectionManager();
    connection.connect();
    setInterval(updateClock, 1000);
});
