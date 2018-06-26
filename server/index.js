require('dotenv').config()
const express = require('express')
    , path    = require('path')
    , router  = express.Router()
    , auth    = require('./authentication')
    , pgp     = require('pg-promise')()
    , bcrypt  = require('bcrypt')
    , uc      = require('./userController')
    , session = require('express-session')
    , tc      = require('./apis/trails')
    , cors    = require('cors')
// const pug = require('pug')

const {
    DB_STRING
    , SALT_ROUNDS
    , PT_PASS
    , SESSION_SECRET
    , API_KEY
} = process.env

const app = express()
app.use(express.json())
app.use(cors())
app.use('/static', express.static('public'))
const db = pgp(DB_STRING)

// db.connect()
//     .then(obj => {
//         console.log('DB Connection Object: ', obj)
//     })

app.use(session({
    secret: SESSION_SECRET || "ghvjhvjahbsdfuhalksdfbkhagd"
    , resave: false
    , saveUninitialized: true
    , cookie: {
        maxAge: 24*60*60*100
    }
}))

router.use('/users', auth.authenticate)

app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.render('home')
})
app.get('/login', (req, res) => {
    res.render('login')
})
app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/contact', (req, res) => {
    res.render('contact')
})
app.get('/about', (req, res) => {
    res.render('about')
})
app.get('/faq', (req, res) => {
    res.render('faq')
})
app.get('/users/dashboard', (req, res) => {
    res.render('dashboard')
})
app.get('/trails', (req, res) => {
    res.render('trails')
})
app.get('/trails/:id', (req, res) => {
    res.render('trails')
})

app.post('/users', uc.createUser)
app.post('/users/login', uc.login)

app.listen(3123, () => {
    console.log(`Listening with pugs on port ${3123}`)
})