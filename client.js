const SQL = require('./sql')
const USER = require("os").userInfo().username
const fs = require('fs')
const privateKeyHex = fs.readFileSync(`/home/mohsin/.sawtooth/keys/mohsin.priv`, 'utf8')
const VaultClient = require("./VaultClient")
const csv = require('csv-parser')
const logger = require('perfect-logger');
const { Log_Dir } = require("./config")

logger.setLogDirectory(Log_Dir);
logger.setLogFileName("client");
logger.initialize();

var UFrecords = [];
var ParsedRecords = [];
var Frecords = [];

const sql = new SQL()
const client = new VaultClient(privateKeyHex)

// let record =
//   {
//   CustID: "274380001044392",
//   CustName: "ASHQAR 1",
//   TradeChannel: "HFS Small T.G.",
//   recordDate: "2019-10-01"
// }

async function execute(limit, offset) 
{ 
 // const records = Frecords.slice(offset, offset + 25)
    let records = await sql.readRecords(limit, offset)
  // let frecords = []
  // await records.forEach(element => {
  // frecords.push(JSON.stringify(element))
  // }) 	
  const transactions = await client.CreateTransactions(records, sql)
  const batch = await client.CreateBatch(transactions)
  await client.SubmitBatch(batch)
}

///home/mohsin/Documents/CSV_files/Pre_Processed/PreProcessed.csv

// async function main() {
//   fs.createReadStream('/home/ibneali/Desktop/FullDataBlockchain-11Jan/CompleteData.csv')
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
//       console.log(Frecords.length)
//       await loadRecords()
//     })

// }

var delay  

async function loadRecords() {
  // console.log("LoadFunction")
  console.log()
  var recordSize = await sql.readCount();
  //console.log(recordSize);
  //await sql.readRecords(0, 0).length;

  console.log(recordSize);

  for (var i =  0, limit = 25; i < recordSize; i = i + limit) {
    if(recordSize - i < limit) {
      if(recordSize % limit != 0) {
        limit = recordSize - i
      }
    }
    if( i != 0 && i % 2500 == 0 ) {
      //7000
      delay = 7000
    } else {
     //2000
      delay = 2000
    }
    await sleep(delay)
    await execute(limit, i)
    console.log("\n" + i + "\n")
    logger.info(i.toString())
  }
}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

//loadRecords()
//main()

module.exports = loadRecords