require('dotenv').config()
const express       = require('express')
    , path          = require('path')
    , session       = require('express-session')
    , cors          = require('cors')
    , passport      = require('passport')
    , routes        = require('./routes')
    , MySQLStore    = require('express-mysql-session')(session)

    // , flash         = require('express-flash')
// comented the next line out because the view-engine set up in express takes care of this;
//   this style is used for other use-cases of pug
// const pug = require('pug')

// Here begin the seemingly redundent notes for anyone interested in the use for things in the server file.
// Advanced devs, plz excuse the sometimes pointless/obvious notes

// destructuring the environment variables for use in file without repetitive process.env
const {
    DB_PASS
    , DB_USER
    , DB_HOST
    , SESSION_SECRET
    , DB_PORT
    , DB_NAME
    , SERVER_PORT
} = process.env

const app = express()
// const db = pgp(DB_STRING)

// setting the static files (for references to the static folder) to point to the public folder
app.use('/static', express.static('public', { redirect: true}))
// express' version of body-parser to parse the data from post's and place onto req.body 
app.use(express.json({ limit: '5mb'}))
// fixes some POST usage with jQuery for some reason.......????...
app.use(express.urlencoded({ extended: false }))

app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'pug')
app.set('view cache', true)
// cors middleware for ...... cors. Duh
app.use(cors())
// using flash for flash messaging user with req.flash, mainly for errors
// app.use(flash())

// creating MySQL Session Store
const sessionStore = new MySQLStore({
    host: DB_HOST
    , port: DB_PORT
    , user: DB_USER
    , password: DB_PASS
    , database: DB_NAME
    , createDatabaseTable: true
    , schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
})

// setting up session
app.use(session({
    secret: SESSION_SECRET || "ghvjhvjahbsdfuhalksdfbkhagd"
    , store: sessionStore
    , resave: false
    , saveUninitialized: true
    , cookie: {
        maxAge: 24*60*60*1000
    }
}))

// setting up passport to.... 
app.use(passport.initialize())
// .... handle sessions:
app.use(passport.session())

app.use('/', routes)

// custom top level middleware to see what is arriving on the req.body
// logging url helps debug which route has the underlying issue
// also checking the session object to see what is available
app.use((req, res, next) => {
    console.log('URL: ', req.url, 'Method: ', req.method, 'Body: ', req.body, 'Session Obj: ', req.session, 'SessionPassport User: ', req.session.passport, 'Req User: ', req.user)
    next()
})

app.listen(SERVER_PORT, () => {
    console.log(`Listening with pugs on port ${SERVER_PORT}`)
})