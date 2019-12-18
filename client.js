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

async function execute(offset) {

  const records = Frecords.slice(offset, offset + 25)//await sql.readRecords(100, offset)
  // let frecords = []
  // await records.forEach(element => {
  // frecords.push(JSON.stringify(element))
  // }) 	
  const transactions = await client.CreateTransactions(records, sql)
  const batch = await client.CreateBatch(transactions)
  await client.SubmitBatch(batch)
}


async function main() {
  fs.createReadStream('/home/mohsin/Documents/CSV_files/Analysis P_G/Csvs/APIAT_IS_DAILY_20191031.csv')
    .pipe(csv(['DUE_PERD', 'CUST_ID', 'CustomerName', 'TradeChannel']))
    .on('data', (data) => UFrecords.push(data))
    .on('end', async () => {
      // console.log(results.slice(0, 10))
      console.log(UFrecords.length)
      UFrecords.forEach(element => {
        ParsedRecords.push(JSON.stringify(element))
      })
      Frecords = [...new Set(ParsedRecords)]
      console.log(Frecords.length)
      await loadRecords()
    })

}

var delay  

async function loadRecords() {
  // console.log("LoadFunction")
  console.log()

  for (var i = 0 , limit = 25; i < Frecords.length; i = i + limit) {
    if(Frecords.length - i < limit) {
      if(Frecords.length % limit != 0) {
        limit = Frecords - i
      }
    }
    if( i != 0 && i % 2500 == 0) {
      delay = 7000
    } else {
      delay = 2000
    }
    await sleep(delay)
    await execute(i)
    console.log("\n" + i + "\n")
    logger.info(i.toString())
  }
}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

main()
