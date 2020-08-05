'use strict';

const path = require('path');

var ipcRenderer = require('electron').ipcRenderer;

var myButton = document.querySelector("#mybutton")
var tbody = document.querySelector("#data-table")
var clearButton = document.querySelector("#clear-button")
var exportButton = document.querySelector("#export-button")
var urlPrefixInput = document.querySelector("#url-prefix")

myButton.addEventListener('click', function () {
  console.log('clicked button');
  ipcRenderer.send('choose-files-to-process', '');
})

exportButton.addEventListener('click', function () {
  ipcRenderer.send('EXPORT_CSV_FILE', {urlPrefix: urlPrefixInput.value});
})

clearButton.addEventListener('click', () => {
  console.log("clicked clear button")
  ipcRenderer.send('CLEAR_CSV_DATA', '');
})

ipcRenderer.on('CSV_UPDATED', (event, data) => {
  console.log("event", event);
  console.log('data', data);
  if (data && data.length>0) {

    clearButton.setAttribute("style", 'display: block');
    exportButton.setAttribute("style", 'display: block');
  } else {
    clearButton.setAttribute("style", 'display: none');
    exportButton.setAttribute("style", 'display: none');

  }
  let innerHtml = "";
  data.forEach(row => {
    innerHtml += `<tr><td scope="row">${row.speaker}</td><td scope="row">${row.title}</td><td scope="row">${row.conferenceName}</td><td scope="row">${row.year}</td></tr>`
  })
  tbody.innerHTML = innerHtml;
})

