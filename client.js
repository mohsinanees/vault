const SQL = require('./sql')
const USER = require("os").userInfo().username
const fs = require('fs')
const privateKeyHex = fs.readFileSync(`/home/${USER}/.sawtooth/keys/${USER}.priv`, 'utf8')
const VaultClient = require("./VaultClient")
const csv = require('csv-parser')

// Load the perfect-logger module
let logger = require('perfect-logger');

// Configure Settings
logger.setLogDirectory("./");
logger.setLogFileName("client");

// Initialize
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

  const records = Frecords.slice(offset, offset + 101)//await sql.readRecords(100, offset)
  // let frecords = []
  // await records.forEach(element => {
  // frecords.push(JSON.stringify(element))
  // }) 	
  const transactions = await client.CreateTransactions(records, sql)
  const batch = await client.CreateBatch(transactions)
  await client.SubmitBatch(batch)
}


async function main() {
  fs.createReadStream('./test30.csv')
  .pipe(csv())
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

async function loadRecords() {
  // console.log("LoadFunction")
  console.log()

  for (var i = 3000; i < Frecords.length; i = i + 100) {
    await sleep(5000)
    await execute(i)
    console.log("\n" + i + "\n")
    logger.info(i.toString());
  }
}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

main()