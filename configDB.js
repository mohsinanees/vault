require('dotenv').config()

module.exports = {
  development: {
	host: "137.182.194.140",
	driver: "postgres",
	username: "blockchain_user",
	port: "5432",
	database: "blockchain",
	password: "fjaldsf(*8jk_jfa",
  dialect : "postgres",
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

