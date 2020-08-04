'use strict';

const path = require('path');

var ipcRenderer = require('electron').ipcRenderer;
var EVENTS = require(path.resolve('app/event-names'));

var myButton = document.querySelector("#mybutton")
var tbody = document.querySelector("#data-table")
var clearButton = document.querySelector("#clear-button")

myButton.addEventListener('click', function () {
  console.log('clicked button');
  ipcRenderer.send(EVENTS.CHOOSE_FILES, '');

})

clearButton.addEventListener('click', () => {
  console.log("clicked clear button")
  ipcRenderer.send(EVENTS.CLEAR_CSV_DATA, '');
})

ipcRenderer.on(EVENTS.CSV_UPDATED, (event, data) => {
  console.log("event", event);
  console.log('data', data);
  let innerHtml = "";
  data.forEach(row => {
    innerHtml += `<tr><td>${row.speaker}</td><td>${row.title}</td><td>${row.conferenceName}</td><td>${row.year}</td></tr>`
  })
  tbody.innerHTML = innerHtml;
})
