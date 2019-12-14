
'use strict'

const { InvalidTransaction } = require('sawtooth-sdk/processor/exceptions')
const { createHash } = require('crypto')
const cbor = require('cbor')
const { Random } = require("random-js")
const random = new Random();

class VaultPayload {
    constructor(CustID, CustName, TradeChannel, recordDate) {
        this.CustID = CustID
        this.CustName = CustName
        this.TradeChannel = TradeChannel
        this.recordDate = recordDate
        this.hash = createHash('sha256').update(JSON.stringify({ CustID, TradeChannel })).digest('hex')
        // this.timestamp = new Date().getTime().toString() + random.int32().toString()
    }

    static fromBytes(payload) {

        let res = cbor.decode(payload)
        if (res) {

            if (!res.CustID) {
                res.CustID = "N/A"
            }

            if (!res.CustName) {
                res.CustName = "N/A"
            }

            if (!res.TradeChannel) {
                res.TradeChannel = "N/A"
            }

            if (!res.recordDate) {
                res.recordDate = "N/A"
            }

            return new VaultPayload(res.CustID, res.CustName, res.TradeChannel, res.recordDate)
        } else {
            throw new InvalidTransaction('Invalid payload serialization')
        }

    }
}

module.exports = VaultPayload
