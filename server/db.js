require('dotenv').config()
const { DB_USER, DB_HOST, DB_PASS, DB_NAME } = process.env
    // , pgp = require('pg-promise')()
    , mysql        = require('mysql')

// const db = pgp(DB_STRING)
const db = mysql.createConnection({
    host: DB_HOST
    , user: DB_USER
    , password: DB_PASS
    , database: DB_NAME
})

db.connect(err => {
    if(err) return console.log(err)
    console.log('Maria DB Connected')
})

module.exports = db