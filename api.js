
const express = require('express');
const request = require('request')
const cbor = require('cbor')
const axios = require("axios");
const cors = require("cors");
const { _genVaultAddress } = require("./namespace.js");

const app = express();
const PORT = 5000
app.options('*', cors());
app.use(cors());
var prevAddress
var OFFSET
var offset = ''
var end = '27fd19863d1ea1f7a9cfcc3138c1956ef2a606cd195fd3b9d6708f2c015970a8490f0c0d0be02ea548c7d785b65f9d677ef99df1686090fc95c91e910a30ec0a'
var hash = ''
var customerHistory = []

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

        // let customerHistory = []
        let data = ' '
        while (data) {
            console.log(offset)
            await getHistory(address)
            if (offset == end) {
                break
            }
        }
        customerHistory = customerHistory.filter(String)
        let hash
        if (customerHistory.length > 0) {
            hash = customerHistory[customerHistory.length - 1].hash
            for (i = customerHistory.length - 1; i >= 0; i--) {
                let status = true
                if (hash != customerHistory[i].hash) {
                    hash = customerHistory[i].hash
                    status = false
                }
                customerHistory[i]["status"] = status
            }
        }
        res.status(200).send(customerHistory)
        offset = ''
        hash = ''
        customerHistory = []
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
    let payloadList = []
    // let hash

    transactions.data.filter(value => {
        if (value.header.inputs.includes(stateAddress)) {
            // console.log(value.header_signature)
            payloadList.push(value.payload)
        }
    })

    // payloadList = payloadList.slice(offset, offset + 10)
    payloadList.forEach(element => {

        let data = Buffer.from(element, 'base64')
        data = cbor.decode(data)
        // console.log("\nhash:")
        // console.log(data.hash + "\n")
        customerHistory.push(data)
    })
    // console.log(res)
    offset = transactions.data[transactions.data.length - 1].header_signature
    // console.log(offset)
    // return res
};