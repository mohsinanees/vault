'use strict'
const { createHash } = require('crypto')
const cbor = require('cbor')
var colors = require('colors')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const VaultPayload = require('./payload')
const SQL = require('./sql')
let flogger = require('perfect-logger');

flogger.setLogDirectory("/home/mohsin/logs");
flogger.setLogFileName("vault_processor");

flogger.initialize();

const { TransactionHandler } = require('sawtooth-sdk/processor/handler')
const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')

const { VAULT_FAMILY,
  VERSION,
  VAULT_NAMESPACE,
  _genVaultAddress } = require('./namespace');

const { DEBUG, WARN } = require("./config");

var count = 0

const _setEntry = (context, address, stateValue) => {
  let entries = {
    [address]: cbor.encode(stateValue)
  }
  return context.setState(entries)
}

const _applySet = (context, address, payload) => async (possibleAddressValues) => {
  let stateValueRep = possibleAddressValues[address]
  const sql = new SQL()
  let message = {...payload}
  let stateValue;

  if (stateValueRep && stateValueRep.length > 0) {

    stateValue = cbor.decodeFirstSync(stateValueRep)

    if (stateValue.hash != payload.hash) {

    //   const record = await sql.readRecord(payload.CustID, payload.recordDate, payload.TradeChannel)
    //   console.log("\n", record)

    //   if (record) {
    //     //console.log(finalDate)
    //     let status = await sql.readAnomalous(record.customerId, payload.recordDate, payload.TradeChannel)
    //     // console.log("\n", status)
    //     if (!status) {
    //       let stat = await sql.insertAnomalous(record.customerId, payload.recordDate, payload.TradeChannel).catch(err => {
    //         throw err
    //       })
    //       //console.log(stat)
    //     }
    message['Prev_TradeChannel'] = stateValue.TradeChannel
    message['Prev_StateHash'] = stateValue.hash
    if(count == 0) {
        message['Anomalous_Status'] = 'true'
        logger(message, WARN)
        await csvWriter.writeRecords([message])
        count++ 
    } else {
        count = 0
    }

    } else {
        if(count == 0) {
            message['Anomalous_Status'] = 'false'
            logger(message, DEBUG)
            await csvWriter.writeRecords([message])
            count++ 
        } else {
            count = 0
        }
    }
    

  } else {
    if(count == 0) {
        message['Anomalous_Status'] = 'false'
        message['Prev_TradeChannel'] = 'null'
        message['Prev_StateHash'] = 'null'
        logger(message, DEBUG)
        await csvWriter.writeRecords([message])
        count++ 
    } else {
        count = 0
    }
 }
  stateValue = {...payload}
  return _setEntry(context, address, stateValue)
}


class VaultHandler extends TransactionHandler {
  constructor() {
    console.info(('[' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') +
      ' INFO\tvault_processor]').green)
    super(VAULT_FAMILY, [VERSION], [VAULT_NAMESPACE])
  }

  apply(transactionProcessRequest, context) {
    let payload = VaultPayload.fromBytes(transactionProcessRequest.payload)
    let header = transactionProcessRequest.header

    let CustID = payload.CustID
    let date = payload.recordDate
    let address = _genVaultAddress(CustID)

    let promise = context.getState([address])
    //console.log(promise)
    let actionPromise = promise.then(
      // let currentstate = cbor.decode(res)
      // console.log("Current State\n"+currentstate)

      _applySet(context, address, payload)

    )

    return actionPromise.then(addresses => {
      if (addresses.length === 0) {
        throw new InternalError('State Error!')
      } 
    })

  }
}

const logger = (message, log) => {

  if (log == WARN) {
    console.warn(('[' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' ' +
      WARN + '\tvault_processor' + ']').yellow +
      `Hash in the state does not match the hash in Transaction\n` +
      `CustID: ${message.CustID}\n` +
      `Name: ${message.CustName}\n` +
      `TradeChannel: ${message.TradeChannel}\n`.red +
      `hash: ${message.hash}\n`.yellow +
      `Prev_TradeChannel: ${message.Prev_TradeChannel}`.yellow +
      `Previous Statehash: ${message.Prev_StateHash}`.yellow)
    flogger.warn(('[' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' ' +
      WARN + '\tvault_processor' + ']').yellow +
      `Hash in the state does not match the hash in Transaction` +
      `CustID: ${message.CustID}` +
      `Name: ${message.CustName}` +
      `TradeChannel: ${message.TradeChannel}` +
      `Prev_TradeChannel: ${message.Prev_TradeChannel}`.yellow +
      `Previous Statehash: ${message.Prev_StateHash}`.yellow)
  } else if (log == DEBUG) {
    console.log(('[' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' ' +
      DEBUG + '\tvault_processor' + ']').green + '\n' +
      `CustID: ${message.CustID}\n` +
      `Name: ${message.CustName}\n` +
      `TradeChannel: ${message.TradeChannel}\n` +
      `hash: ${message.hash}`)
    flogger.info(('[' + new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '') + ' ' +
      DEBUG + '\tvault_processor' + ']').green +
      `CustID: ${message.CustID}` +
      `Name: ${message.CustName}` +
      `TradeChannel: ${message.TradeChannel}` +
      `hash: ${message.hash}`)
  }

}

module.exports = VaultHandler