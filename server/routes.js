// this file exists to separate the renering routes from api routes that
// require some action to be performed other than simply rendering a pug file
require('dotenv').config()
const axios       = require('axios')
    , { API_KEY, G_MAPS_KEY } = process.env
    , db = require('./db')
    , mysql = require('mysql')

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
    , renderSearchResults: (req, res) => {
        const { location, difficulty, rating, max_distance, minimun_length } = req.body
        let difficulties = ['green', 'greenBlue', 'blue', 'any', 'blueBlack', 'black', 'dblack']
        let diffString = difficulties[difficulty/1]
        axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
            params:{
                address: location
                , key: G_MAPS_KEY
            }
        }).then(googleRes => {
            console.log(googleRes.data.results[0], googleRes.data.results[0].address_components)
            let userLat = googleRes.data.results[0].geometry.location.lat/1
            let userLng = googleRes.data.results[0].geometry.location.lng/1
            let cityObj = googleRes.data.results[0].address_components.find(v => v.types.includes('locality' || 'political'))
            let city = cityObj ? cityObj.long_name : null
            let state = googleRes.data.results[0].address_components.find(v => v.types.includes('administrative_area_level_1')).long_name

            // Don't need the following data for now, but just for reference:
            
            // let foundLocation = googleRes.data.results[0].formatted_address
            // let stNum = googleRes.data.results[0].address_components.find(v => v.types.includes('street_number')).long_name
            // let stName = googleRes.data.results[0].address_components.find(v => v.types.includes('route')).long_name
            // let country = googleRes.data.results[0].address_components.find(v => v.types.includes('country')).long_name
            // let zipCode = googleRes.data.results[0].address_components.find(v => v.types.includes('postal_code')).long_name


            axios.get(`https://www.hikingproject.com/data/get-trails?lat=${userLat}&lon=${userLng}&maxDistance=${max_distance/1}&maxResults=20&minLength=${minimun_length/1 || 1}&minStars=${rating/1 || 1}&key=${API_KEY}`).then(trailsResponse => {
                let qualifiedTrails = diffString !== 'any' ? trailsResponse.data.trails.filter(v=> v.difficulty === diffString) : trailsResponse.data.trails
                console.log(trailsResponse.data.trails, qualifiedTrails)
                res.render('search_results', { user: req.user, searchResults: qualifiedTrails, city, state })
            }).catch(err => {
                console.log('Trail Search API Results Error: ', err)
            })

        }).catch(err => {
            console.log('google Geolocation API Error: ', err)
        })
    }
    , renderTrails: (req, res) => {
        res.render('trails', { user: req.user })
    }
    , renderWishlist: (req, res) => {
        res.render('wishlist_page', { user: req.user })
    }
    , renderSuggestionsForm: (req, res) => {
        res.render('suggestion', { user: req.user })
    }
    , renderCompletedForm: (req, res) => {
        console.log('Rendering Completed Form, req.params: ', req.params)
        const { trailID} = req.params
        db.query(`SELECT * FROM trails WHERE trail_id = ${mysql.escape(trailID)}`, (err, completedTrail) => {
            if(err) {
                console.log('Error getting Completed Trail from Trails db Table: ', err)
            }else{
                res.render('completed_form', { completedTrail: JSON.parse(JSON.stringify(completedTrail))[0] })
            }
        })
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