const { createContext, CryptoFactory } = require('sawtooth-sdk/signing')
const { createHash } = require('crypto')
const { protobuf } = require('sawtooth-sdk')
const cbor = require('cbor')
const request = require('request')
let logger = require('perfect-logger');

// Configure Settings
logger.setLogDirectory("./logs");
logger.setLogFileName("client");

// Initialize
logger.initialize();

const { Secp256k1PrivateKey } = require('sawtooth-sdk/signing/secp256k1')
const VaultPayload = require('./payload')
const { VAULT_FAMILY, VERSION, _genVaultAddress } = require('./namespace');
const { BATCH_URL } = require("./config")

class VaultClient {
  constructor(privateKeyHex) {
    this.context = createContext('secp256k1')
    this.privateKey = Secp256k1PrivateKey.fromHex(privateKeyHex)
    let signer = new CryptoFactory(this.context)
    this.signer = signer.newSigner(this.privateKey)
  }

  async CreateTransactions(records, dbHandler) {
    const signer = this.signer
    const signerPubKey = signer.getPublicKey().asHex()

    let address
    let transactions = []
    records.forEach(async (record) => {
      const payload = new VaultPayload(
        record.CUST_ID,
        record.CustomerName,
        record.TradeChannel,
        record.DUE_PERD)

      // let res = dbHandler.readAddress(payload.CustID);
      // // console.log("getting res data here ")
      // if (res) {
      //   address = res
      // } else {
      //   let addrRecord = dbHandler.readRecord(payload.CustID, payload.recordDate)
      address = _genVaultAddress(payload.CustID)
      //    dbHandler.insertAddress(addrRecord.customerId, address.toString())
      // }

      const payloadBytes = cbor.encode(payload)
      //console.log("creating")
      const transactionHeaderBytes = protobuf.TransactionHeader.encode({
        familyName: VAULT_FAMILY,
        familyVersion: VERSION,
        inputs: [address],
        outputs: [address],
        signerPublicKey: signerPubKey,
        nonce: new Date().toISOString(),
        batcherPublicKey: signerPubKey,
        dependencies: [],
        payloadSha512: createHash('sha512').update(payloadBytes).digest('hex')
      }).finish()
      //console.log("finish")

      const signature = signer.sign(transactionHeaderBytes)

      const transaction = protobuf.Transaction.create({
        header: transactionHeaderBytes,
        headerSignature: signature,
        payload: payloadBytes
      })
      //console.log("done")
      transactions.push(transaction)
    })

    //console.log("out of second then")
    //let filteredTransactions = [...new Set(transactions)];
    //	console.log(filteredTransactions )
    return transactions

  }

  async CreateBatch(transactions) {
    const signer = this.signer
    const batchHeaderBytes = protobuf.BatchHeader.encode({
      signerPublicKey: signer.getPublicKey().asHex(),
      transactionIds: transactions.map((txn) => txn.headerSignature),
    }).finish()

    const signature = signer.sign(batchHeaderBytes)

    const batch = protobuf.Batch.create({
      header: batchHeaderBytes,
      headerSignature: signature,
      transactions: transactions
    })

    const batchListBytes = protobuf.BatchList.encode({
      batches: [batch]
    }).finish()

    return batchListBytes
  }

  async SubmitBatch(batchListBytes) {
    request.post({
      url: BATCH_URL,
      body: batchListBytes,
      headers: { 'Content-Type': 'application/octet-stream' }
    }, (err, response) => {
      if (err) return console.log(err)
      console.log(response.body)
      logger.info(response.body);
    })
  }
  // async SubmitBatch(batchListBytes) {
  //     request.post({
  //       url: BATCH_URL,
  //       body: batchListBytes,
  //       headers: { 'Content-Type': 'application/octet-stream' }
  //     }, (err, response) => {
  //       if (err) return console.log(err)
  //       console.log(response.body)
  //       let res = JSON.parse(response.body)
  // //       if (res.hasOwnProperty('error')) {
  // //             //console.log(res.error.code + "\n\n")
  // //             if(res.error.code == 31) {
  // //               console.log(batchListBytes)
  // //               await this.SubmitBatch(batchListBytes)
  // //             }    
  // //           } 
  //     })
  //   }
}

module.exports = VaultClient
