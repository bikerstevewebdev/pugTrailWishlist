require('dotenv').config()
const { DB_STRING } = process.env
    , pgp = require('pg-promise')()

const db = pgp(DB_STRING)

module.exports = db