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
            console.log('renderHome : ', req.user)
            if(req.user){
                const { username, user_id, fullname, email, admin_id, wishlist } = req.user
                let safeUser = {
                    username
                    , user_id
                    , fullname
                    , email
                    , admin_id
                    , wishlist
                }
                res.render('home', {
                    user: safeUser,
                    trails: trailsResponse.data.trails
                })
            }else{
                res.render('home', {
                    user: req.user,
                    trails: trailsResponse.data.trails
                })
            }
        })
    }
    , renderSignup: (req, res) => {
        res.render('signup')
    }
    , renderContact: (req, res) => {
        if(req.user){

        }else{

        }
        console.log('renderContact : ', req.user)
        const { username, user_id, fullname, email, admin_id, wishlist } = req.user
        let safeUser = {
            username
            , user_id
            , fullname
            , email
            , admin_id
            , wishlist
        }
        res.render('contact', { user: safeUser})
    }
    , renderAbout: (req, res) => {
        if(req.user){

        }else{

        }
        console.log('renderAbout : ', req.user)
        const { username, user_id, fullname, email, admin_id, wishlist } = req.user
        let safeUser = {
            username
            , user_id
            , fullname
            , email
            , admin_id
            , wishlist
        }
        res.render('about', { user: safeUser })
    }
    , renderFAQ: (req, res) => {
        console.log('renderFAQ : ', req.user)
        if(req.user){
            const { username, user_id, fullname, email, admin_id, wishlist } = req.user
            let safeUser = {
                username
                , user_id
                , fullname
                , email
                , admin_id
                , wishlist
            }
            res.render('faq', { user: safeUser })
        }else{
            res.render('faq', { user: req.user })
        }
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
    , renderSuggestion: (req, res) => {
        console.log('renderDash : ', req.user)
        if(req.user){
            const { username, user_id, fullname, email, admin_id, wishlist } = req.user
            let safeUser = {
                username
                , user_id
                , fullname
                , email
                , admin_id
                , wishlist
            }
            res.render('suggestion', { user: safeUser })
        }else{
            res.render('suggestion', { user: req.user })
        }
    }
    , renderTrails: (req, res) => {
        console.log('renderTrails : ', req.user)
        if(req.user){
            const { username, user_id, fullname, email, admin_id, wishlist } = req.user
            let safeUser = {
                username
                , user_id
                , fullname
                , email
                , admin_id
                , wishlist
            }
            res.render('trails', { user: safeUser })
        }else{
            res.render('trails', { user: req.user })
        }
    }
    , renderOneTrail: (req, res) => {
        console.log('renderOneTrail : ', req.user)
        if(req.user){
            const { username, user_id, fullname, email, admin_id, wishlist } = req.user
            let safeUser = {
                username
                , user_id
                , fullname
                , email
                , admin_id
                , wishlist
            }
            axios.get(`https://www.hikingproject.com/data/get-trails-by-id?ids=${req.params.id}&key=${API_KEY}`).then(trailData => {
                let trail = trailData.data.trails[0]
                res.render('trails', { trail , user: safeUser})
            })
        }else{
            axios.get(`https://www.hikingproject.com/data/get-trails-by-id?ids=${req.params.id}&key=${API_KEY}`).then(trailData => {
                let trail = trailData.data.trails[0]
                res.render('trails', { trail , user: req.user})
            })
        }
    }
    , sendFailStatus: (req, res) => {
        res.status(500).send({message: req.query.message})
    }
}