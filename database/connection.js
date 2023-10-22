const {Sequelize} = require('sequelize')
require('dotenv').config({ path:'./vars.env' })

const password = process.env.MYSQL_ADDON_PASSWORD
const user =  process.env.MYSQL_ADDON_USER
const DB = process.env.MYSQL_ADDON_DB
const host = process.env.MYSQL_ADDON_HOST
const dialect = process.env.MYSQL_ADDON_DIALECT

const sequelize = new Sequelize(
    DB,
    user,
    password,
    {
        dialect,
        host
    }
)

module.exports = sequelize