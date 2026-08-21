

const signal_ctx = document.getElementById('signal_chart').getContext('2d');
const volt_ctx = document.getElementById('volt_chart').getContext('2d');
Chart.defaults.color = 'rgb(255,255,255)';
const sig_chart = new Chart(signal_ctx, {
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
        plugins: {
            title: {
                display: false,          
                text: 'Signal Strength',
                color: 'rgb(255,255,255)',          
                font: {
                    size: 18,           
                    weight: 'bold'      
                },
                padding: { top: 10, bottom: 30 } // Optional: Spacing
            },
            legend: {
                labels: {
                    boxWidth: 0
                }
            }
        },
        scales: {
            x: {
                title: { display: false, text: 'Sequence #'},
                grid: {
                    color: 'rgb(114, 113, 101)'
                },
                ticks: {
                    color: 'rgb(0,255,255)'
                }
            },
            y: {
                title: {display: true, text: 'dBm'},
                grid: {
                    color: 'rgb(114, 113, 101)'
                },
                suggestedMin: -100,
                suggestedMax: -30
            }
        }
    }
})

const v_chart = new Chart(volt_ctx, {
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
            pointRadius: 5
        }]
    },
    options: {
        responsive: true,
        animation: false,
        normalized: true,
        maintainAspectRatio: false,
        plugins: {
            title: {
                display: false,          
                text: 'Voltage',
                color: 'rgb(255,255,255)',          
                font: {
                    size: 18,           
                    weight: 'bold'      
                },
                padding: { top: 10, bottom: 30 } 
            },
            legend: {
                labels: {
                    boxWidth: 0
                }
            }
        },
        scales: {
            x: {
                title: { display: false, text: 'Sequence #'},
                grid: {
                    color: 'rgb(114, 113, 101)'
                },
                ticks: {
                    color: 'rgb(0,255,255)'
                }
            },
            y: {
                title: {display: true, text: 'VDC'},
                grid: {
                    color: 'rgb(114, 113, 101)'
                },
                suggestedMin: 8,
                suggestedMax: 14
            }
        }
    }
})

async function updateCharts(sequence, signal, volts){
    const MAX_SEQ = 4;
    const MAX_V = 4;
    sig_chart.data.labels.push(sequence);
    v_chart.data.labels.push(sequence);
    sig_chart.data.datasets[0].data.push(`${signal}`);
    
    v_chart.data.datasets[0].data.push(volts);

    if(sig_chart.data.labels.length > MAX_SEQ){
        sig_chart.data.labels.shift();
        sig_chart.data.datasets[0].data.shift();
    }
    sig_chart.update('none');

    if(v_chart.data.labels.length > MAX_V){
        v_chart.data.labels.shift();
        v_chart.data.datasets[0].data.shift();
    }
    v_chart.update('none');
}

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
        const signalSpan = document.getElementById('signal');
        signalSpan.innerText = `Signal Strength: ${data.signal ? data.signal : ___} dBm`;
        if(data.signal >= -55){
            signalSpan.style.color = "#4caf50";
            
        }
        else if(data.signal > -70 && data.signal < -55){
            signalSpan.style.color = "#ff9800";
        }
        else if(data.signal < -80){
            signalSpan.style.color = "#FF0000";
        }
        document.getElementById('seq').innerText = `Sequence: ${data.sequence ? data.sequence : "___"}`;
        document.getElementById('volts').innerText = `Voltage: ${data.voltage ? data.voltage.toFixed(2) : "___"} VDC`;
        
        const statusDiv = document.getElementById('status');
        if (data.connected) {
            statusDiv.innerText = "Connected.";
            statusDiv.style.color = "#4caf50";
        } else {
            statusDiv.innerText = "Waiting for transmission...";
            statusDiv.style.color = "#888";
        }
        updateCharts(data.sequence, data.signal, data.voltage);

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
