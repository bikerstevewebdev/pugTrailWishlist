// this file exists to separate the renering routes from api routes that
// require some action to be performed other than simply rendering a pug file
require('dotenv').config()
const axios       = require('axios')
    , { API_KEY } = process.env

module.exports = {
    renderLogin: (req, res) => {
        res.render('login')
    }
    , renderProfile: (req, res) => {
        res.render('profile', { user: req.user })
    }
    , renderHome: (req, res) => {
        axios.get(`https://www.hikingproject.com/data/get-trails?lat=40.7608&lon=-111.8910&maxDistance=20&maxResults=5&key=${API_KEY}`).then(trailsResponse => {
            console.log('renderHome User: ', req.user, 'Trails Difficulty: ', trailsResponse.data.trails.map(v => v.difficulty), "Trail sample: ", trailsResponse.data.trails[0])
            res.render('home', {
                user: req.user,
                trails: trailsResponse.data.trails
            })
        })
    }
    , renderSignup: (req, res) => {
        res.render('signup')
    }
    , renderContact: (req, res) => {
        res.render('contact', { user: req.user})
    }
    , renderAbout: (req, res) => {
        res.render('about', { user: req.user })
    }
    , renderFAQ: (req, res) => {
        res.render('faq', { user: req.user })
    }
    , renderDashboard: (req, res) => {
        if(req.user){
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
        }else{
            res.status(403).redirect('/')
        }
    }
    , renderSearch: (req, res) => {
        res.render('search', { user: req.user })
    }
    , renderTrails: (req, res) => {
        res.render('trails', { user: req.user })
    }
    , renderOneTrail: (req, res) => {
        console.log('renderOneTrail : ', req.user)
            axios.get(`https://www.hikingproject.com/data/get-trails-by-id?ids=${req.params.id}&key=${API_KEY}`).then(trailData => {
                let trail = trailData.data.trails[0]
                res.render('trails', { trail , user: req.user})
            })
    }
    , sendFailStatus: (req, res) => {
        res.status(500).send({message: req.query.message})
    }
}