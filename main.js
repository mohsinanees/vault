const fs = require('fs')
//const Client = require("./client")

const express = require('express')
const loadRecords = require("./client.js")
const app = express()
const port = 5522

app.get('/blockchain', function (req, res) {
    res.send('Blockchain Started')
    loadRecords()
})

app.listen(port, () => console.log(`Blockchain loader listening on port ${port}!`))