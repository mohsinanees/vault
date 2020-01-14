require('dotenv').config()

module.exports = {
  development: {
    host: "192.168.0.164",
    driver: "postgres",
    username: "postgres",
    port: "5432",
    database: "blockchain_DEV",
    password: "123456",
    dialect: "postgres",
    logging: false
  },
  test: {
    url: process.env.TEST_DATABASE_URL,
    dialect: 'postgres',
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
  },
}
