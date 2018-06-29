// this file exists to separate the renering routes from api routes that
// require some action to be performed other than simply rendering a pug file
require('dotenv').config()
const axios       = require('axios')
    , { API_KEY } = process.env

module.exports = {
    renderLogin: (req, res) => {
        res.render('login')
    }
    , renderHome: (req, res) => {
        axios.get(`https://www.hikingproject.com/data/get-trails?lat=40.7608&lon=-111.8910&maxDistance=10&key=${API_KEY}`).then(trailsResponse => {
            res.render('home', {
                user: req.session.user,
                trails: trailsResponse.data.trails
            })
        })
    }
    , renderSignup: (req, res) => {
        res.render('signup')
    }
    , renderContact: (req, res) => {
        res.render('contact')
    }
    , renderAbout: (req, res) => {
        res.render('about')
    }
    , renderFAQ: (req, res) => {
        res.render('faq')
    }
    , renderDashboard: (req, res) => {
        console.log('renderDash : ', req.user)
        const { username, user_id, fullname, email, admin_id, wishlist } = req.user
        let safeUser = {
            username
            , user_id
            , fullname
            , email
            , admin_id
            , wishlist
        }
        res.render('dashboard', { user: safeUser })
    }
    , renderSuggestion: (req, res) => {
        res.render('suggestion')
    }
    , renderTrails: (req, res) => {
        res.render('trails')
    }
    , renderOneTrail: (req, res) => {
        res.render('trails')
    }
}