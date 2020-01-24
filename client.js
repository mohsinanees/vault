const SQL = require('./sql')
const USER = require("os").userInfo().username
const fs = require('fs')
const privateKeyHex = fs.readFileSync(`/home/${USER}/.sawtooth/keys/${USER}.priv`, 'utf8')
const VaultClient = require("./VaultClient.js")
const logger = require('perfect-logger');
const { log_dir } = require("./config.js")

logger.setLogDirectory(log_dir);
logger.setLogFileName("client");
logger.initialize()

const sql = new SQL()
const client = new VaultClient(privateKeyHex)

// let record =
//   {
//   CustID: "274380001044392",
//   CustName: "ASHQAR 1",
//   TradeChannel: "HFS Small T.G.",
//   recordDate: "2019-10-01"
// }

async function execute(limit, offset) {
  let records = await sql.readRecords(limit, offset)
  const transactions = await client.CreateTransactions(records, sql)
  const batch = await client.CreateBatch(transactions)
  await client.SubmitBatch(batch)
}

var delay

async function loadRecords() {
  // console.log("LoadFunction")
  console.log()
  var recordSize = await sql.readCount();
  console.log(recordSize);
  var offset = Number(fs.readFileSync('./temp.txt'));
  console.log(offset.toString());
  console.log("Program Ended" + offset);
  for (var i = 0, limit = 25; offset < recordSize; offset = offset + limit) {
    console.log("inloop")
    if (recordSize - offset < limit) {
      if (recordSize % limit != 0) {
        limit = recordSize - offset
      }
    }
    if (i != 0 && i % 2500 == 0) {
      //7000
      delay = 7000
    } else {
      //2000
      delay = 2000
    }
    await sleep(delay)
    await execute(limit, offset)
    console.log("\n" + offset + "\n")
    logger.info(offset.toString())
  }
  fs.writeFile("./temp.txt", recordSize, (err) => {
    if (err) console.log(err);
    console.log("Successfully Written to File.");
  });

}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

//loadRecords()
//main()


module.exports = loadRecords