const NodeID3 = require('node-id3')
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
module.exports = {
  processFile: function (fileName) {
    let tags = NodeID3.read(fileName);
    console.log('tags', tags);
    let row = this.convertTags(tags);
    row.fileName = path.basename(fileName);
    return row;
  },
  addUrl: function (data, urlPrefix) {
    let updatedData = [];
    data.forEach(line => {
      if (!urlPrefix.endsWith('/')) {
        urlPrefix += '/'
      }
      line.url = urlPrefix + line.fileName.replace(/ /g, '+');
      updatedData.push(line);
    });
    return updatedData;
  },
  addBody: function (data, templateText) {
    let updatedData = [];
    data.forEach(line => {
      let txt = templateText;
      txt = txt.replace(/{{url}}/g, line.url);
      txt = txt.replace(/{{speaker}}/g, line.speaker);
      txt = txt.replace(/{{title}}/g, line.speaker);
      txt = txt.replace(/{{conferenceName}}/g, line.conferenceName);
      txt = txt.replace(/{{year}}/g, line.year);
      line.body = txt;
      updatedData.push(line);
    });
    return data;
  },

  convertTags: function (tags) {
    let row = {
      conferenceName: '',
      speaker: '',
      year: '',
      title: '',
      fileName: '',
      url: '',
      body: ''
    };
    if (tags) {

      if (tags.album) {
        var confName = tags.album;
        if (tags.album.endsWith("MP3 Fullset")) {
          confName = confName.substring(0,
              confName.length - "MP3 Fullset".length)
        }
        row.conferenceName = confName.trim();
      }
      if (tags.artist) {
        row.speaker = tags.artist
      }
      if (tags.year) {
        row.year = tags.year
      }
      if (tags.title) {
        row.title = tags.title
      }
    }
    return row;
  },
  createCsvFile: function (data, pathToFile) {
    const csvWriter = createCsvWriter({
      path: pathToFile,
      header: [
        {id: 'conferenceName', title: 'Conference'},
        {id: 'speaker', title: 'Speaker'},
        {id: 'title', title: 'Title'},
        {id: 'year', title: 'Year'},
        {id: 'fileName', title: 'FileName'},
        {id: 'url', title: 'URL'},
        {id: 'body', title: 'Body'}
      ]
    });

    csvWriter.writeRecords(data)       // returns a promise
    .then(() => {
      console.log('...Done');
    });
  }
}
