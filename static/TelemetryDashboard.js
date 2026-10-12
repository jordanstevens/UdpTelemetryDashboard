class Dashboard{
    stats = {
        signal: {min: 0, max: 0, avg: 0, sum: 0, count: 0},
        temperature: {min: 0, max: 0, avg: 0, sum: 0, count: 0},
        humidity: {min: 0, max: 0, avg: 0, sum: 0, count: 0},    
    }

    constructor(){
        this.signal_ctx = document.getElementById('signal_chart').getContext('2d');
        this.temp_ctx = document.getElementById('temperature_chart').getContext('2d');
        this.hum_ctx = document.getElementById('humidity_chart').getContext('2d');
        Chart.defaults.color = 'rgb(255,255,255)';
        this.signal_chart = new Chart(this.signal_ctx, {
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
                        else if(value >= -70) return '#ff9800';
                        else return '#FF0000'; 
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
        this.temp_chart = new Chart(this.temp_ctx, {
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
        this.humidity_chart = new Chart(this.hum_ctx, {
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
                        if(value < 30 || value > 60) return '#FF0000';
                        else if(value < 40 || value > 50) return '#ff9800';
                        else return '#4caf50';
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
    }

    updateCharts(sequence, signal, temperature, humidity){
        this.refreshCharts(this.signal_chart, sequence, signal);
        this.refreshCharts(this.temp_chart, sequence, temperature);
        this.refreshCharts(this.humidity_chart, sequence, humidity);
    }
    
    refreshCharts(chart, label, value){
        const MAX_TICKS = 4;    
        chart.data.labels.push(label);
        chart.data.datasets[0].data.push(value);
        if(chart.data.labels.length > MAX_TICKS){
            chart.data.labels.shift();
            chart.data.datasets[0].data.shift();
        }
        chart.update('none');
    }

    updateStats(sig, temp, hum){
        const sensors = [
            {name: 'signal', data: sig},
            {name: 'temperature', data: temp},
            {name: 'humidity', data: hum}
        ];
        for(const item of sensors){
            const sensor = this.stats[item.name];
            if(sensor.count === 0){
                sensor.min = item.data;
                sensor.max = item.data;
                sensor.sum = item.data;
            }
            else{
                if(item.data < sensor.min) sensor.min = item.data;
                if(item.data > sensor.max) sensor.max = item.data;
                sensor.sum += item.data;
            }
            sensor.count ++;
            sensor.avg = sensor.sum / sensor.count;
        }
    }

    displayStats(){
        document.getElementById('signal_min').innerText = `Low: ${this.stats.signal.min.toFixed(2)}`;
        document.getElementById('signal_max').innerText = `High: ${this.stats.signal.max.toFixed(2)}`;
        document.getElementById('signal_avg').innerText = `Avg: ${this.stats.signal.avg.toFixed(2)}`;
        
        document.getElementById('temperature_min').innerText = `Low: ${this.stats.temperature.min.toFixed(2)}`;
        document.getElementById('temperature_max').innerText = `High: ${this.stats.temperature.max.toFixed(2)}`;
        document.getElementById('temperature_avg').innerText = `Avg: ${this.stats.temperature.avg.toFixed(2)}`;
    
        document.getElementById('humidity_min').innerText = `Low: ${this.stats.humidity.min.toFixed(2)}`;
        document.getElementById('humidity_max').innerText = `High: ${this.stats.humidity.max.toFixed(2)}`;
        document.getElementById('humidity_avg').innerText = `Avg: ${this.stats.humidity.avg.toFixed(2)}`;
    }
}

function updateClock() {
    const timeElement = document.getElementById('time');
    if (timeElement){
        const now = new Date();
        timeElement.innerText = now.toLocaleTimeString();
    }
}

function processTelemetry(data, dashboard) {        
    const signalSpan = document.getElementById('signal');
    const tempSpan = document.getElementById('temperature');
    const humSpan = document.getElementById('humidity');
    
    document.getElementById('seq').innerText = `Packet: ${data.sequence ? data.sequence : "___"}`;

    signalSpan.innerText = `Signal Strength: ${data.signal ? data.signal : "___"} dBm`;
    if(data.signal >= -55) signalSpan.style.color = "#4caf50";
    else if(data.signal >= -70) signalSpan.style.color = "#ff9800";
    else signalSpan.style.color = "#FF0000";
    
    tempSpan.innerText = `Temperature: ${data.temperature ? data.temperature.toFixed(2) : "___"} °F`;
    if(data.temperature > 87) tempSpan.style.color = "#FF0000";
    else if(data.temperature > 82) tempSpan.style.color = "#ff9800";
    else tempSpan.style.color = "#4caf50";
    
    humSpan.innerText = `Relative Humidity: ${data.humidity ? data.humidity.toFixed(2) : "___"} %`;
    if(data.humidity < 30 || data.humidity > 60) humSpan.style.color = "#FF0000";
    else if(data.humidity < 40 || data.humidity > 50) humSpan.style.color = "#ff9800";
    else humSpan.style.color = "#4caf50";

    dashboard.updateStats(data.signal, data.temperature, data.humidity);
    dashboard.updateCharts(data.sequence, data.signal, data.temperature, data.humidity);
    dashboard.displayStats();
}

class ConnectionManager{
    watchdog = null;
    statusDiv = document.getElementById('status');

    constructor(telemetryCallback){
        this.telemetryCallback = telemetryCallback;
    }
    
    onOpen = () => {
        this.updateConnectionStatus("open");
        console.log("Connection Opened");
    };

    onMessage = (event) => {
        try{
            const message = JSON.parse(event.data);
            this.updateConnectionStatus("connected");
            console.log("Message Received!");
            this.telemetryCallback(message);
            this.resetWatchdog();
        }
        catch(error){
            console.log("Parsing Error: ", error);
        }
    };

    onClose = (event) => {
        console.log(event.code);
        this.updateConnectionStatus("disconnected");
        console.log("Disconnected. Cleaning up.");
        this.cleanup();
        setTimeout(this.connect(), 3000);
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

    resetWatchdog(){
        clearTimeout(this.watchdog);
        this.watchdog = setTimeout(()=>{
            console.warn("Watchdog timed out. Disconnecting.");
            this.updateConnectionStatus("disconnected");
            this.socket.close();
        }, 2500);
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
        clearTimeout(this.watchdog);
        this.socket.removeEventListener("open", this.onOpen);
        this.socket.removeEventListener("message", this.onMessage);
        this.socket.removeEventListener("close", this.onClose);
        this.socket.removeEventListener("error", this.onError);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const dashboard = new Dashboard();
    updateClock();
    const connection = new ConnectionManager((payload)=>{
        processTelemetry(payload, dashboard);
    });
    connection.connect();
    window.addEventListener("pagehide", ()=>{
        if(connection.socket.readyState === WebSocket.OPEN){
            connection.socket.close();
        }
    });
    setInterval(updateClock, 1000);
});
