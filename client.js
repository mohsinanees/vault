const SQL = require('./sql')
const USER = require("os").userInfo().username
const privateKeyHex = fs.readFileSync(`/home/dawood.ud/.sawtooth/keys/dawood.ud.priv`, 'utf8')
const VaultClient = require("./VaultClient")
const csv = require('csv-parser')
const fs = require('fs')
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


fs.createReadStream('C:\\Users\\AUTOMATA\\Desktop\\Blockchain_(30thOct-10thNov).csv')
  .pipe(csv())
  .on('data', (data) => UFrecords.push(data))
  .on('end', async () => {
    // console.log(results.slice(0, 10))
    console.log(results.length)
    UFrecords.forEach(element => {
      ParsedRecords.push(JSON.stringify(element))
    })
      Frecords = [...new Set(res)]
      console.log(Frecords.length) 
  });

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

//execute(0)
loadRecords()

  
async function loadRecords()
{
  // console.log("LoadFunction")
  console.log()
  
  for (var i = 0; i < Frecords.length; i= i + 100) 
  {
    await sleep(1500)
    await execute(i, sql, client)
    console.log("\n\n" + i +"\n\n")
    logger.info("\n" + i + "\n");
  }
}

 function sleep(ms){
  return new Promise(resolve=>{
      setTimeout(resolve,ms)
  })
}
