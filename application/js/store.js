module.exports = {
  csvData: [],
  clearData: function () {
    this.csvData = [];
  },
  addRow: function (row) {
    this.csvData.push(row);
  }
}
