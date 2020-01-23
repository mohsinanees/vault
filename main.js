const express = require('express')
const loadRecords = require('./client')

const app = express()
const port = 3000

app.get('/loadrecords/', (req, res) => {

    //res.send('Processing...')
    loadRecords()
   
})




app.listen(port, () => console.log(`Example app listening on port ${port}!`))