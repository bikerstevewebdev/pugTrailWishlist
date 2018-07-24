require('dotenv').config()
// const users = require('express').Router()
const bcrypt          = require('bcrypt')
    , { SALT_ROUNDS, API_KEY } = process.env
    , db              = require('../db')
    , mysql           = require('mysql')
    , axios           = require('axios')
    , userRouter      = require('express').Router()
    , moment          = require('moment')
    , s3Controller    = require('../awsS3')

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
userRouter.get('/completed',                 renderCompleted)
userRouter.get('/journey/:id',               renderJourney)
userRouter.get('/trails/completed/:trailID', renderCompletedForm)
userRouter.post('/wishlist/completed/:id',   markTrailCompleted)
userRouter.post('/wishlist/:id',             addTrailToWishlist)
userRouter.delete('/wishlist/:id',           removeTrailFromWishlist)
userRouter.post('/profile',                  updateProfile)
userRouter.post('/profile/pictures',         s3Controller.uploadPhoto)

function renderProfile(req, res) {
    res.render('profile', { user: req.user })
}

function renderWishlist(req, res) {
    res.render('wishlist_page', { user: req.user })
}

function renderJourney(req, res) {
    const { user } = req
        , { id } = req.params
    if(user.completed.find(v => v.completed_id === id/1)){
        db.query('SELECT c.*, t.trail_id, t.img_medium, t.name FROM completed c JOIN trails t ON t.trail_id = c.trail_id WHERE c.completed_id = ?', [id/1], (err, journeyInfo) => {
            if(err){
                console.log(`ERROR Fetching data for Journey with ID ${id}: `,err)
            }else{
                let jsonnedJE = JSON.parse(JSON.stringify(journeyInfo[0]))
                    , momentoDate = moment(jsonnedJE.date_completed).format('dddd, MMMM Do, YYYY')
                    , dateFreindlyJE = { ...jsonnedJE, date_completed: momentoDate }
                res.render('journey', { journalEntry: dateFreindlyJE, user })
            }
        })
    }else{
        res.status(401).redirect('/login')
    }
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

// function login(req, res) {
//         const { password, username } = req.body
//         db.query('SELECT ALL FROM users WHERE username = ?', [username], data => {
//             console.log('DB User Data from Login: ', data[0])
//             bcrypt.compare(password, data[0].password, valid => {
//                 if(valid){
//                     res.render('dashboard', { user: req.session.user, userInfo: data })
//                 }else{
//                     req.flash('Incorrect Password')
//                 }
//             })
//         })
//     }

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

function removeTrailFromWishlist(req, res){
    const { id } = req.params
        , { user } = req
    console.log('Removing Trail with ID of : ', id)
    db.query('DELETE FROM wishlist WHERE user_id = ? AND trail_id = ?', [user.user_id, id], (err, dbResponse) => {
        if(err){
            console.log('Error removing trail from user\'s wishlist')
        }else{
            console.log('Trail successfully removed')
            res.sendStatus(200)
        }
    })
}

function renderCompleted (req, res) {
    const { user } = req
    res.render('completed_page', { user })
}

function renderDashboard(req, res) {
    res.render('dashboard', { user: req.user })
    }
function renderCompletedForm(req, res) {
        console.log('Rendering Completed Form, req.params: ', req.params)
        const { trailID } = req.params
        db.query(`SELECT * FROM trails WHERE api_id = ${mysql.escape(trailID/1)}`, (err, completedTrail) => {
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
            , { user } = req
            , { user_id } = user
        // let insertObj = {trail_id: id, user_id, notes, company, date_completed, hiker_rating: rating, seconds_taken: time_completed_in, family_friendly, dog_friendly, traffic}
        // db.query('INSERT INTO completed SET ?', insertObj, function(err, dbResponse){
        db.query('INSERT INTO completed SET trail_id = ?, user_id = ?, notes = ?, company = ?, date_completed = ?, hiker_rating = ?, seconds_taken = ?, family_friendly = ?, dog_friendly = ?, traffic = ?;', [id/1, user_id, notes, company, date_completed, rating, time_completed_in, family_friendly, dog_friendly, traffic], function(err, dbResponse){
            if(err) {
                console.log('Insert Into completed ERROR: ', err)
            }else{
                console.log(dbResponse)
                db.query('UPDATE wishlist SET completed = 1 WHERE user_id = ? AND trail_id = ?', [user.user_id, id], (err, markCompleteRes) => {
                    if(err){
                        console.log(`ERROR Marking Trail ${id} Completed: `, err)
                    }else{
                        console.log(markCompleteRes)
                        res.status(200).send(JSON.parse(JSON.stringify({ msg1: dbResponse.message, msg2: markCompleteRes.message })))
                    }
                })
            }
        })
    }

    function updateProfile(req, res) {
        console.log('Hey uh you are editing the profile so yeah hey there')
        const { user } = req
        const { username, fullname, email, profile_pic } = req.body
        db.query(`UPDATE users SET username = ?, fullname = ?, email = ?, profile_pic = ?`, [username, fullname, email, profile_pic], (err, dbResponse) => {
            if(err){
                console.log('Error updating user profile: ', err)
            }else{
                console.log('success updating profile!')
                res.sendStatus(200)
            }
        })
    }


module.exports = userRouter

// ${mysql.escape(id)}, ${mysql.escape(notes)}, ${mysql.escape(company)}, ${mysql.escape(date_completed)}, ${mysql.escape(rating)}, ${mysql.escape(time_completed_in)}, ${mysql.escape(family_friendly)}, ${mysql.escape(dog_friendly)}, ${mysql.escape(traffic)}${mysql.escape(id)}, ${mysql.escape(notes)}, ${mysql.escape(company)}, ${mysql.escape(date_completed)}, ${mysql.escape(rating)}, ${mysql.escape(time_completed_in)}, ${mysql.escape(family_friendly)}, ${mysql.escape(dog_friendly)}, ${mysql.escape(traffic)}