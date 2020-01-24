const { createContext, CryptoFactory } = require('sawtooth-sdk/signing')
const { createHash } = require('crypto')
const { protobuf } = require('sawtooth-sdk')
const cbor = require('cbor')
const request = require('request')
let logger = require('perfect-logger');
const { Secp256k1PrivateKey } = require('sawtooth-sdk/signing/secp256k1')
const { VAULT_FAMILY, VERSION, _genVaultAddress } = require('./namespace.js');
const { BATCH_URL, log_dir } = require("./config.js")

logger.setLogDirectory(log_dir);
logger.setLogFileName("client");
logger.initialize();

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
    records.forEach(async (StringifiedRecord) => {
      let record = StringifiedRecord

      const payload = {
        CustID: record.CustID,
        CustName: record.CustName,
        TradeChannel: record.TradeChannel,
        recordDate: record.recordDate,
        hash: createHash('sha256').update(JSON.stringify([record.CustID, record.TradeChannel])).digest('hex')
      }
      address = _genVaultAddress(payload.CustID)
      const payloadBytes = cbor.encode(payload)
      const transactionHeaderBytes = protobuf.TransactionHeader.encode({
        familyName: VAULT_FAMILY,
        familyVersion: VERSION,
        inputs: [address],
        outputs: [address],
        signerPublicKey: signerPubKey,
        nonce: new Date().getTime().toString(),
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
}

module.exports = VaultClient
