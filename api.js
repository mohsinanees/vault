
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

app.get('/history/:id', async (req, res) => {
    let CustID = req.params.id
    let address = _genVaultAddress(CustID)
    if (address) {
        if (address == prevAddress) {
            console.log("in if")
            console.log(OFFSET)
            const data = await getHistory(address, OFFSET)
            OFFSET += 10
            res.status(200).send(data)

        } else {
            console.log("in else")
            OFFSET = 0
            const data = await getHistory(address, OFFSET)
            OFFSET = 10
            prevAddress = address
            res.status(200).send(data)
        }

    }

});

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});

const getHistory = async (stateAddress, offset) => {

    let parameters = {
        limit: 10000
    }

    return await axios.get('http://127.0.0.1:8008/transactions',
        {
            params: parameters
        }
    ).then(response => {
        const transactions = response.data;
        let res = []
        let payloadList = []
        let hash

        transactions.data.filter(value => {
            if (value.header.inputs.includes(stateAddress)) {
                payloadList.push(value.payload)
            }
        })

        payloadList = payloadList.slice(offset, offset + 10)

        if (payloadList.length > 0) {

            let data = Buffer.from(payloadList[0], 'base64')
            data = cbor.decode(data)
            hash = data.hash
        }

        payloadList.forEach(element => {

            let data = Buffer.from(element, 'base64')
            let status = true
            data = cbor.decode(data)

            if (hash != data.hash) {
                hash = data.hash
                status = false
            }
            data["status"] = status
            res.push(data)
        })
        return res
    })
};