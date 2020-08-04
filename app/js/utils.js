const NodeID3 = require('node-id3')
module.exports = {
  processFile: function (fileName) {
    let tags = NodeID3.read(fileName);
    console.log('tags', tags);
    let row = this.convertTags(tags);
    row.fileName = fileName;
    return row;
  },

  convertTags: function (tags) {
    let row = {
      conferenceName: '',
      speaker: '',
      year: '',
      title: '',
      fileName: '',
      url: ''
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
  }
}
