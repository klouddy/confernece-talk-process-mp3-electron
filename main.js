const {app, BrowserWindow, ipcMain, dialog} = require('electron')
const appUtils = require('./app/js/utils');
const EVENTS = require('./app/event-names');
const csvData = require('./app/store');

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  })

  // and load the index.html of the app.
  win.loadFile('app/index.html')
  win.webContents.openDevTools();
}

ipcMain.on(EVENTS.CLEAR_CSV_DATA, (event, args) => {
  csvData.clearData();
  event.sender.send(EVENTS.CSV_UPDATED, csvData.csvData);
})

ipcMain.on(EVENTS.CHOOSE_FILES, (event, args) => {
  console.log('events', event);
  console.log('args', args);

  dialog.showOpenDialog({properties: ['openFile', 'multiSelections']})
  .then(results => {
    console.log('results', results);
    if (results && results.filePaths) {
      results.filePaths.forEach(
          filePath => {
            let row = appUtils.processFile(filePath)
            csvData.addRow(row);
          }
      )
    }
    event.sender.send(EVENTS.CSV_UPDATED, csvData.csvData);
  }).catch(err => {
    console.log("error occurred", err);
    event.sender.send('files', [])
  });
})

app.whenReady().then(createWindow)
