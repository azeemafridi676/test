// src/main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');
const { getLatestPosition } = require('./api/traccarApi');

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(() => {
  createWindow();

  const deviceId = '2'; // Replace with your device's Unique ID

  // Function to fetch and log the latest position
  const fetchAndLogPosition = async () => {
    try {
      const position = await getLatestPosition(deviceId);
      console.log('Latest Position:', position);
    } catch (error) {
      console.error('Error fetching position:', error.message);
    }
  };

  // Fetch the position immediately and then every 5 seconds
  fetchAndLogPosition();
  setInterval(fetchAndLogPosition, 500000); // 5000 ms = 5 seconds

  // app.on('activate', function () {
  //   if (BrowserWindow.getAllWindows().length === 0) createWindow()
  // });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
});