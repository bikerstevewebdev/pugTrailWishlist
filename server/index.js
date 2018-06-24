const express = require('express')
const path = require('path')
const router = express.Router()
const users = require('./users')
// const pug = require('pug')

const app = express()

router.use('/users', users)

app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'pug')

app.get('/', (req, res) => {
    res.render('home')
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

app.listen(3123, () => {
    console.log(`Listening with pugs on port ${3123}`)
})