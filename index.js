const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="sw">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>MUNGAJR MINES SIGNAL</title>
        <style>
            body { background-color: #0d1117; color: white; font-family: 'Segoe UI', sans-serif; display: flex; flex-direction: column; align-items: center; min-height: 100vh; margin: 0; padding: 20px; }
            
            /* Section ya Logo na Title */
            .logo-container { display: flex; align-items: center; gap: 15px; margin-bottom: 25px; border-bottom: 1px solid #30363d; padding-bottom: 15px; width: 100%; max-width: 400px; justify-content: center; }
            .logo-m { width: 50px; height: 50px; background: linear-gradient(135deg, #007bff, #00ff88); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 30px; font-weight: bold; color: white; box-shadow: 0 0 15px rgba(0, 123, 255, 0.5); position: relative; overflow: hidden; }
            .logo-m::after { content: ''; position: absolute; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); animation: shine 2s infinite; }
            @keyframes shine { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
            
            .main-header { font-size: 19px; font-weight: bold; color: #fff; letter-spacing: 1px; text-transform: uppercase; margin: 0; text-shadow: 0 0 10px rgba(0,123,255,0.5); }
            
            .current-time { font-size: 14px; color: #8b949e; margin-bottom: 15px; font-family: monospace; }
            
            .main-container { width: 100%; max-width: 420px; background: #161b22; border-radius: 20px; border: 1px solid #30363d; padding: 20px; text-align: center; box-shadow: 0 10px 40px rgba(0,0,0,0.6); }
            .header-info { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; font-size: 11px; color: #8b949e; }
            .grid-box { background: #0d1117; border-radius: 15px; padding: 15px; border: 1px solid #21262d; margin-bottom: 25px; }
            .grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
            .cell { aspect-ratio: 1; background: #21262d; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 22px; color: transparent; border: 1px solid #30363d; transition: all 0.3s ease; }
            .cell.active { background: rgba(0, 255, 136, 0.1); border: 2px solid #00ff88; color: #00ff88; box-shadow: 0 0 20px rgba(0, 255, 136, 0.4); animation: pulse 2s infinite; }
            
            @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.7; } 100% { transform: scale(1); opacity: 1; } }

            .signal-info { display: flex; justify-content: space-between; align-items: center; margin-top: 15px; padding-top: 15px; border-top: 1px solid #30363d; }
            .status-badge { background: #0d1117; padding: 6px 14px; border-radius: 20px; font-size: 11px; color: #00ff88; font-weight: bold; border: 1px solid #00ff88; box-shadow: 0 0 10px rgba(0, 255, 136, 0.2); }
            
            .schedule-section { width: 100%; max-width: 420px; margin-top: 40px; }
            .schedule-title { font-size: 13px; color: #58a6ff; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 2px; border-left: 4px solid #007bff; padding-left: 12px; }
            .schedule-item { background: #161b22; margin-bottom: 12px; padding: 15px; border-radius: 15px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #30363d; transition: 0.2s; }
            .schedule-item:hover { border-color: #58a6ff; background: #1c2128; }
            .schedule-item.active-now { border-color: #00ff88; background: rgba(0, 255, 136, 0.05); box-shadow: 0 0 15px rgba(0, 255, 136, 0.1); }
            .win-rate { color: #00ff88; font-weight: bold; font-size: 13px; }
            .time-text { font-size: 13px; color: #fff; font-weight: bold; font-family: monospace; }
        </style>
    </head>
    <body>
        <div class="logo-container">
            <div class="logo-m">M</div>
            <h1 class="main-header">MUNGAJR MINES SIGNAL</h1>
        </div>
        
        <div class="current-time" id="live-clock">--:-- --</div>
        
        <div class="main-container">
            <div class="header-info">
                <span>⭐ 3 STARS SIGNAL</span>
                <span style="background:#0d1117; padding:5px 12px; border-radius:12px; color:#fff; border: 1px solid #30363d;">Mines ya nyota</span>
                <span style="color:#f85149; font-weight:bold;">3 TRAPS</span>
            </div>

            <div class="grid-box">
                <div class="grid" id="grid"></div>
            </div>

            <div class="signal-info">
                <div style="text-align:left;">
                    <div style="font-size:15px; font-weight:bold; letter-spacing:1px;">SIGNAL #15</div>
                    <div style="font-size:11px; color:#00ff88; font-weight:bold;">ACTIVE NOW</div>
                </div>
                <div class="status-badge">94% WIN RATE</div>
            </div>
        </div>

        <div class="schedule-section">
            <div class="schedule-title">Today's Schedule</div>
            <div id="schedule-list"></div>
        </div>

        <script>
            function updateClock() {
                const now = new Date();
                document.getElementById('live-clock').innerText = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});
            }
            setInterval(updateClock, 1000);

            function generateGrid() {
                const grid = document.getElementById('grid');
                grid.innerHTML = '';
                let activeIndices = new Set();
                while(activeIndices.size < 3) activeIndices.add(Math.floor(Math.random() * 25));

                for(let i=0; i<25; i++) {
                    const cell = document.createElement('div');
                    cell.className = 'cell' + (activeIndices.has(i) ? ' active' : '');
                    cell.innerHTML = activeIndices.has(i) ? '⭐' : '';
                    grid.appendChild(cell);
                }
            }

            const scheduleData = [
                { id: 14, time: "08:45 PM", win: "89%", status: "Expired" },
                { id: 15, time: "09:05 PM", win: "94%", status: "Active Now" },
                { id: 16, time: "09:30 PM", win: "91%", status: "Upcoming" },
                { id: 17, time: "10:00 PM", win: "87%", status: "Upcoming" },
                { id: 18, time: "10:30 PM", win: "90%", status: "Upcoming" }
            ];

            function renderSchedule() {
                const list = document.getElementById('schedule-list');
                list.innerHTML = scheduleData.map(item => \`
                    <div class="schedule-item \${item.status === 'Active Now' ? 'active-now' : ''}">
                        <div>
                            <div style="font-size:14px; font-weight:bold;">Signal #\${item.id} <span class="win-rate">(\${item.win})</span></div>
                            <div style="font-size:10px; color:#8b949e; margin-top:3px;">\${item.status}</div>
                        </div>
                        <div style="text-align:right;">
                            <div class="time-text">\${item.time}</div>
                            <div style="font-size:10px; color:#58a6ff; margin-top:3px;">\${item.status === 'Upcoming' ? 'Ready soon' : ''}</div>
                        </div>
                    </div>
                \`).join('');
            }

            updateClock();
            generateGrid();
            renderSchedule();
        </script>
    </body>
    </html>
    `);
});

app.listen(PORT);
