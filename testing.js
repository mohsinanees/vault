// const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// const csv = require('csv-parser');
// const fs = require('fs');

// var UFrecords = [];
// var ParsedRecords = [];
// var Frecords = [];
// ///home/mohsin/Documents/CSV_files/Pre_Processed/test.csv
// const csvWriter = createCsvWriter({
//   path: '/home/ibneali/Desktop/FullDataBlockchain-11Jan/CompleteData.csv', append: true,
//   header: ['CUST_ID', 'CustomerName', 'TradeChannel', 'DUE_PERD']
// });
// ///home/mohsin/Documents/CSV_files/Pre_Processed/PreProcessed.csv

// ///home/ibneali/Desktop/CSVFiles/APIAT_IS_DAILY_20200102.csv
// fs.createReadStream('/home/ibneali/Desktop/FullDataBlockchain-11Jan/AllData.csv')
//     .pipe(csv())
//     .on('data', (data) => UFrecords.push(data))
//     .on('end', async () => {
//       // console.log(results.slice(0, 10))
//       console.log(UFrecords.length)
//       UFrecords.forEach(element => {
//         let obj = {'CUST_ID': element.CUST_ID,
//                    'CustomerName': element.CustomerName,
//                    'TradeChannel': element.TradeChannel,
//                    'DUE_PERD': element.DUE_PERD}
//         ParsedRecords.push(JSON.stringify(obj))
//       })
//       Frecords = [...new Set(ParsedRecords)]
//       let records = []

//       Frecords.forEach((element) => {
//         records.push(JSON.parse(element))
//       })
//       console.log(records.length)

//       const data = records
//       //console.log(data)
//       csvWriter
//         .writeRecords(data)
//         .then(()=> console.log('The CSV file was written successfully'));
//     })



const SQL = require('./sql')

 let sql = new SQL();
 //sql.readRecords(20,20)
  sql.insertAnomalous("3631", "2019-10-08", "HFS Small T.G.").then(res =>{
console.log(res)

 }) 
 // console.log(result.length);  

 