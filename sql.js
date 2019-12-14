
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
        let model = models.Product
        let records = []

        records = await model.findAll({
            limit: limit,
            offset: offset,
            attributes: ["due_perd"],
            include: [
                {
                    model: models.Customer,
                    attributes: ["customercode", "customername", "tradechannel"],
                }
            ]
        }).then(res => {
            let result = []

            if (res.length > 0) {

                res.forEach(element => {

                    let recordDate = element.due_perd
                    let CustID = element.Customer.customercode
                    let CustName = element.Customer.customername
                    let TradeChannel = element.Customer.tradechannel
                    result.push({ recordDate, CustID, CustName, TradeChannel })
                });
            }
            return result
        })

        return records
    }

    async readRecord(CustID, date) {
        let model = models.Product
        let record

        record = await model.findAll({
            attributes: ["id"],
            where: {
                due_perd: date
            },

            include: [
                {
                    model: models.Customer,
                    attributes: ["id"],
                    where: {
                        customercode: CustID,
                    }
                }
            ]
        }).then(res => {
            //console.log(res)
            if (res.length > 0) {
                let customerId = res[0].Customer.id
                let record = { customerId }
                return record
            }
        })

        return record
    }

    async readAnomalous(CustID, recordDate, TradeChannel) {
        let model = models.Anomalou
        let Anomalous

        Anomalous = await model.findAll({
            attributes: ["id"],
            where: {
                customerId: CustID,
                new_tradechannel: TradeChannel,
                due_perd: recordDate
            }

        }).then(res => {

            if (res.length > 0) {
                let id = res[0].id
                return { id }
            }
        })

        return Anomalous
    }

    async insertAnomalous(customerId, date, new_tradechannel) {
        // console.log(date)
        let model = await models.Anomalou
        let status

        status = model.create({
            customerId: customerId,
            due_perd: date,
            new_tradechannel: new_tradechannel
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
