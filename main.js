const {app, BrowserWindow, ipcMain, dialog} = require('electron')
const ProgressBar = require('electron-progressbar');
const appUtils = require('./application/js/utils');
const csvData = require('./application/js/store');

const templateTxt = "<div class=\"item-365-audio\"><strong>Speaker: {{speaker}}</strong></div>\n"
    + "<h3>Listen Now</h3>\n"
    + "<p>[audio mp3=\"{{url}}\"][/audio]</p>"

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
  win.loadFile('application/index.html')
  // win.webContents.openDevTools();
}

ipcMain.on('EXPORT_CSV_FILE', (event, args) => {
  console.log('export csv', args);
  let dataToExport = appUtils.addUrl(csvData.csvData, args.urlPrefix);
  dataToExport = appUtils.addBody(dataToExport, args.templateText);
  dialog.showSaveDialog({})
  .then(results => {
    console.log('results to save file', results);
    appUtils.createCsvFile(dataToExport, results.filePath);

  }).catch(err => {
    dialog.showErrorBox("Error", err);
  });

})

ipcMain.on('CLEAR_CSV_DATA', (event, args) => {
  csvData.clearData();
  event.sender.send('CSV_UPDATED', csvData.csvData);
})

ipcMain.on('choose-files-to-process', (event, args) => {
  console.log('events', event);
  console.log('args', args);

  dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [
      {name: 'Audio', extensions: ['mp3']}
    ]
  })
  .then(results => {
    console.log('results', results);
    progressBar = new ProgressBar({
      text: 'Preparing data...',
      detail: 'Handling the tasks you gave me...'
    });
    progressBar
    .on('completed', function () {
      console.info(`completed...`);
      progressBar.detail = 'Task completed. Exiting...';
    })
    .on('aborted', function () {
      console.info(`aborted...`);
    });
    if (results && results.filePaths) {
      results.filePaths.forEach(
          filePath => {
            let row = appUtils.processFile(filePath)
            csvData.addRow(row);
          }
      )
    }
    progressBar.setCompleted();
    event.sender.send('CSV_UPDATED', csvData.csvData);
  }).catch(err => {
    console.log("error occurred", err);
    event.sender.send('files', [])
  });
})

app.whenReady().then(createWindow)
