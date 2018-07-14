require('dotenv').config()
// const users = require('express').Router()
const bcrypt          = require('bcrypt')
    , { SALT_ROUNDS, API_KEY } = process.env
    , db              = require('../db')
    , mysql           = require('mysql')
    , axios           = require('axios')
    , userRouter      = require('express').Router()

userRouter.use('/', (req, res, next) => {
    if(req.user){
        console.log(req.user.username, ' is logged in')
        next()
    }else{
        console.log('WARNING: No User Logged In; Need User info for This Route')
        res.status(403).redirect('/login')
    }
})

userRouter.get('/wishlist',                  renderWishlist)
userRouter.get('/profile',                   renderProfile)
userRouter.get('/dashboard',                 renderDashboard)
userRouter.get('/trails/completed/:trailID', renderCompletedForm)
userRouter.post('/wishlist/completed/:id',   markTrailCompleted)
userRouter.post('/wishlist/:id',             addTrailToWishlist)

function renderProfile(req, res) {
    res.render('profile', { user: req.user })
}

function renderWishlist(req, res) {
    res.render('wishlist_page', { user: req.user })
}

function createUser(body, username, password, next) {
        const { fullname, email } = body
        bcrypt.genSalt(SALT_ROUNDS/1, (err, salt) => {
            if(err){
                console.log('Salt Error: ', err)
            }else{
                bcrypt.hash(password, salt, (err, hash) => {
                    if(err){
                        console.log('Hash Error: ', err)
                    }else{
                        console.log('Hash: ', hash, 'Salt: ', salt)
                        db.query(`INSERT INTO users (username, fullname, email, password) VALUES (${mysql.escape(username)}, ${mysql.escape(fullname)}, ${mysql.escape(email)}, ${mysql.escape(hash)});`, (insertErr, insertRes) => {
                            if(insertErr){
                                console.log('Insert Into Error: ', insertErr)
                            }else{
                                db.query(`SELECT * FROM trailschema.users WHERE username = '${username}';`, (err, newUser) => {
                                    if(err){
                                        console.log('Supposed to be err: ', err.sqlMessage, "Supposed to be results of newUser", newUser)
                                        next(null, false)
                                    }else if(newUser[0].username !== username){
                                        console.log('Creation of New User failed.', err.sqlMessage)
                                        next(null, false)
                                    }else{
                                        next(null, newUser[0])
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }

function login(req, res, next) {
        const { password, username } = req.body
        db.query('SELECT ALL FROM users WHERE username = ?', [username], data => {
            console.log('DB User Data from Login: ', data[0])
            bcrypt.compare(password, data[0].password, valid => {
                if(valid){
                    res.render('dashboard', { user: req.session.user, userInfo: data })
                }else{
                    req.flash('Incorrect Password')
                }
            })
        })
    }

function addTrailToWishlist(req, res) {
        const { id } = req.body
            , { user_id } = req.user
        axios.get(`https://www.hikingproject.com/data/get-trails-by-id?ids=${id}&key=${API_KEY}`).then(trailData => {
            let trail = trailData.data.trails[0]
            db.query(`SELECT * FROM trails WHERE api_id = ${id};`, (err, existingTrail) => {
                if(err){
                    console.log('DB search for existing trail Error: ', err)
                }else if(JSON.parse(JSON.stringify(existingTrail))[0]){
                    console.log("Existing Trail Found: ", existingTrail)
                    db.query(`INSERT INTO wishlist (user_id, trail_id, api_trail_id) VALUES (${mysql.escape(user_id)}, ${mysql.escape(existingTrail[0].trail_id)}, ${mysql.escape(id/1)});`, (err, sqlRes) => {
                        if(err){
                            console.log('ADD To Wishlist SQL Error: ', err)
                            res.sendStatus(500)
                        }else{
                            console.log('New User Wishlist:', sqlRes)
                            res.status(200).send()
                        }
                    })
                }else{
                    db.query(`INSERT INTO trails (api_id, name, description, location, stars, star_votes, difficulty, length, img_sq_small, img_medium, url, ascent, descent, highest, lowest, longitude, latitude) VALUES (${mysql.escape(trail.id)}, ${mysql.escape(trail.name)}, ${mysql.escape(trail.summary)}, ${mysql.escape(trail.location)}, ${mysql.escape(trail.stars)}, ${mysql.escape(trail.starVotes)}, ${mysql.escape(trail.difficulty)}, ${mysql.escape(trail.length)}, ${mysql.escape(trail.imgSqSmall)}, ${mysql.escape(trail.imgMedium)}, ${mysql.escape(trail.url)}, ${mysql.escape(trail.ascent)}, ${mysql.escape(trail.descent)}, ${mysql.escape(trail.high)}, ${mysql.escape(trail.low)}, ${mysql.escape(trail.longitude)}, ${mysql.escape(trail.latitude)}); SELECT * FROM trails WHERE api_id = ${mysql.escape(id)};`, (err, createdTrail) => {
                        if(err){
                            console.log('DB Created Trail Error: ', err)
                        }else{
                            console.log('DB Created Trail Success Response: ', createdTrail)
                            db.query(`INSERT INTO wishlist (user_id, trail_id, api_trail_id) VALUES (${mysql.escape(user_id)}, ${mysql.escape(JSON.parse(JSON.stringify(createdTrail))[1][0].trail_id)}, ${mysql.escape(id/1)});`, (err, wishlistAddResponse) => {
                                if(err){
                                    console.log('Insert new Wishlist Error: ', err)
                                }else{
                                    console.log('SUCCESS! WE HAVE A NEW WISHLIST TRAIL:', wishlistAddResponse)
                                    res.sendStatus(200)
                                }
                            })
                        }
                    })
                }
            })
        })
    }
function renderDashboard(req, res) {
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
function renderCompletedForm(req, res) {
        console.log('Rendering Completed Form, req.params: ', req.params)
        const { trailID } = req.params
        db.query(`SELECT * FROM trails WHERE trail_id = ${mysql.escape(trailID)}`, (err, completedTrail) => {
            if(err) {
                console.log('Error getting Completed Trail from Trails db Table: ', err)
            }else{
                res.render('completed_form', { completedTrail: JSON.parse(JSON.stringify(completedTrail))[0] })
            }
        })
    }
function markTrailCompleted(req, res) {
        console.log('Inside the top of the DocumentCompleted route, req.body: ', req.body)
        const { date_completed, company, rating, time_completed_in, notes, dog_friendly, family_friendly, traffic } = req.body
            , { id } = req.params
            , { user_id } = req.user
        db.query(`INSERT INTO completed (trail_id, notes, company, date_completed, hiker_rating, seconds_taken, family_friendly, dog_friendly, traffic) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`, [ id, notes, company, date_completed, rating, time_completed_in, family_friendly, dog_friendly, traffic ], (err, dbResponse) => {
            if(err) {
                console.log('Insert Into completed ERROR: ', err)
            }else{
                res.status(200).send(JSON.parse(JSON.stringify(dbResponse[0][0])))
            }
        })
    }


module.exports = userRouter

// ${mysql.escape(id)}, ${mysql.escape(notes)}, ${mysql.escape(company)}, ${mysql.escape(date_completed)}, ${mysql.escape(rating)}, ${mysql.escape(time_completed_in)}, ${mysql.escape(family_friendly)}, ${mysql.escape(dog_friendly)}, ${mysql.escape(traffic)}${mysql.escape(id)}, ${mysql.escape(notes)}, ${mysql.escape(company)}, ${mysql.escape(date_completed)}, ${mysql.escape(rating)}, ${mysql.escape(time_completed_in)}, ${mysql.escape(family_friendly)}, ${mysql.escape(dog_friendly)}, ${mysql.escape(traffic)}