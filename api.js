
const express = require('express');
const request = require('request')
const cbor = require('cbor')
const axios = require("axios");
const cors = require("cors");
const { _genVaultAddress } = require("./namespace");

const app = express();
const PORT = 5000
app.options('*', cors());
app.use(cors());
var prevAddress
var OFFSET
var offset = ''
var end  = '4726d367f6e064a532d6baf2e180f51d251128639e447e5dd8c350f45ec1787f3e819493183b485fc2e202fb9f0f350e2eb9a98677bfffbb583086b9f601b7d0'
var hash = ''

app.get('/history/:id', async (req, res) => {
    let CustID = req.params.id
    let address = _genVaultAddress(CustID)
    if (address) {
        // if (address == prevAddress) {
        //     console.log("in if")
        //     console.log(OFFSET)
        //     const data = await getHistory(address, OFFSET)
        //     OFFSET += 10
        //     res.status(200).send(data)

        // } else {
        //     console.log("in else")
        //     OFFSET = 0
        //     const data = await getHistory(address, OFFSET)
        //     OFFSET = 10
        //     prevAddress = address
        //     res.status(200).send(data)
        // }

        let customerHistory = []
        let data = ' '
        while (data) {
            console.log(offset)
            let data = await getHistory(address)
            // console.log(data)
            if (offset == end) {
                break
            }
            customerHistory.push(data)
        } 
        customerHistory = customerHistory.filter(String)
        offset = ''
        // console.log(customerHistory)
        res.status(200).send(customerHistory)
    }

});

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});

const getHistory = async (stateAddress) => {

    let parameters = {
        start: offset,
        limit: 10000
    }

    let response = await axios.get('http://127.0.0.1:8008/transactions',
        {
            params: parameters
        }
    )
        const transactions = response.data;
        // console.log(transactions.data.length)
        let res = []
        let payloadList = []
        // let hash

        transactions.data.filter(value => {
            if (value.header.inputs.includes(stateAddress)) {
                // console.log(value.header_signature)
                payloadList.push(value.payload)
            }
        })

        // payloadList = payloadList.slice(offset, offset + 10)

        if (payloadList.length > 0 && hash == '') {

            let data = Buffer.from(payloadList[0], 'base64')
            data = cbor.decode(data)
            hash = data.hash
        }

        payloadList.forEach(element => {

            let data = Buffer.from(element, 'base64')
            let status = true
            data = cbor.decode(data)
            console.log("\nhash:")
            console.log(data.hash + "\n")
            if (hash != data.hash) {
                hash = data.hash
                status = false
            }
            data["status"] = status
            res.push(data)
        })
        // console.log(res)
        offset = transactions.data[transactions.data.length - 1].header_signature
        // console.log(offset)
        return res
};