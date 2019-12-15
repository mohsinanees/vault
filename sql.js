
const Sequelize = require('sequelize')
require('dotenv').config()
const models = require("./models/")
var env = process.env.NODE_ENV || 'development'
const config = require("./configDB.js")[env]

class SQL {
    constructor() {
        this.recordsCount = 0
        this.sql = new Sequelize(
            config.database,
            config.user,
            config.password,
            {
                port: config.port,
                host: config.server,
                dialect: config.dialect,
                logging: false
            }
        )

    }

    async readRecords(limit, offset) {
        let model = models.Customer
        let records = []

        records = await model.findAll({
            limit: limit,
            offset: offset,
            attributes: ["customercode", "customername", "tradechannel", "due_perd"]
        }).then(res => {
            console.log(res)
            let result = [];

            if (res.length > 0) {

                res.forEach(element => {
                    
                    let CustID = element.customercode;
                    let CustName = element.customername;
                    let recordDate = element.due_perd;
                    let TradeChannel = element.tradechannel;
                    result.push({ CustID, CustName, recordDate, TradeChannel });
                });
            }
            return result;
        })

        return records
    }

    async readRecord(CustID, recordDate, TradeChannel) {
        let model = models.Customer
        let record

        record = await model.findAll({
            attributes: ["id"],
            where: {
                customercode: CustID,
                due_perd : recordDate,
                tradechannel: TradeChannel
            }
        }).then(res => {
            //console.log(res)
            if (res.length > 0) {
                let customerId = res[0].id
                let record = { customerId }
                return record
            }
        })

        return record
    }

    async readAnomalous(customerId, recordDate, TradeChannel) {
        let model = models.Anomalou
        let Anomalous

        Anomalous = await model.findAll({
            attributes: ["id"],
            where: {
                customerId: customerId,
                due_perd: recordDate,
                new_tradechannel: TradeChannel
            }

        }).then(res => {

            if (res.length > 0) {
                let id = res[0].id
                return { id }
            }
        })

        return Anomalous
    }

    async insertAnomalous(customerId, recordDate, TradeChannel) {
        // console.log(date)
        let model = await models.Anomalou
        let status

        status = model.create({
            customerId: customerId,
            due_perd: recordDate,
            new_tradechannel: TradeChannel
        }).then(res => {
            if (res.length > 0) {
                return true
            }
        })

        return status
    }

    async readAddress(CustID) {
        let model = models.State_Address
        let address

        address = await model.findAll({
            attributes: ["state_address"],
            include: [

                {
                    model: models.Customer,
                    attributes: [],
                    where: {
                        customercode: CustID,
                    }
                }
            ]

        }).then(res => {

            if (res.length > 0) {
                return res.state_address
            }
        })

        return address
    }

    async insertAddress(customerId, stateAddress) {
        let model = models.State_Address
        let status

        status = await model.create({
            customerId: customerId,
            state_address: stateAddress
        }).then(res => {
            if (res.length > 0) {
                return true
            }
        })

        return status
    }
}

module.exports = SQL
