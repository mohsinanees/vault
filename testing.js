const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csv = require('csv-parser');
const fs = require('fs');

var UFrecords = [];
var ParsedRecords = [];
var Frecords = [];

const csvWriter = createCsvWriter({
  path: '/home/mohsin/Documents/CSV_files/Pre_Processed/test.csv', append: true,
  header: ['CUST_ID', 'CustomerName', 'TradeChannel', 'DUE_PERD']
});

fs.createReadStream('/home/mohsin/Documents/CSV_files/Pre_Processed/PreProcessed.csv')
    .pipe(csv())
    .on('data', (data) => UFrecords.push(data))
    .on('end', async () => {
      // console.log(results.slice(0, 10))
      console.log(UFrecords.length)
      UFrecords.forEach(element => {
        let obj = {'CUST_ID': element.CUST_ID,
                   'CustomerName': element.CustomerName,
                   'TradeChannel': element.TradeChannel,
                   'DUE_PERD': element.DUE_PERD}
        ParsedRecords.push(JSON.stringify(obj))
      })
      Frecords = [...new Set(ParsedRecords)]
      let records = []

      Frecords.forEach((element) => {
        records.push(JSON.parse(element))
      })
      console.log(records.length)

      const data = records
      //console.log(data)
      csvWriter
        .writeRecords(data)
        .then(()=> console.log('The CSV file was written successfully'));
    })
