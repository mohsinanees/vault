const fs = require('fs')
const express = require('express')
const loadRecords = require("./client.js")
const app = express()
const port = 5522
var data;


app.get('/blockchain', function (req, res) {
    res.send('Blockchain loader Started')
    loadRecords()
})


app.listen(port, () => console.log(`Blockchain loader listening on port ${port}!`))