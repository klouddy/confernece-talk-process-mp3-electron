'use strict';

const path = require('path');

var ipcRenderer = require('electron').ipcRenderer;
var EVENTS = require(path.resolve('app/event-names'));

var myButton = document.querySelector("#mybutton")
var tbody = document.querySelector("#data-table")
var clearButton = document.querySelector("#clear-button")
var exportButton = document.querySelector("#export-button")

myButton.addEventListener('click', function () {
  console.log('clicked button');
  ipcRenderer.send(EVENTS.CHOOSE_FILES, '');
})

exportButton.addEventListener('click', function () {
  ipcRenderer.send(EVENTS.EXPORT_CSV, '');
})

clearButton.addEventListener('click', () => {
  console.log("clicked clear button")
  ipcRenderer.send(EVENTS.CLEAR_CSV_DATA, '');
})

ipcRenderer.on(EVENTS.CSV_UPDATED, (event, data) => {
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

