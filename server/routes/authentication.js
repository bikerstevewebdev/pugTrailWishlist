const authRouter    = require('express').Router()
    , passport      = require('passport')
    , LocalStrategy = require('passport-local')
    , db            = require('../db')
    , bcrypt        = require('bcrypt')
    , uc            = require('./userController')
// using local strategy for custom login handling
passport.use(new LocalStrategy(
    { passReqToCallback: true }
    , function(req, username, password, done) {
        console.log('INSIDE OF PASSPORT STRATEGY. username: ', username, ' and password: ', password)
        db.query(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
            if(err){
                throw err
            }else{
                console.log(req.body)
                if(!user[0] && req.body.email){
                    uc.createUser(req.body, username, password, done)
                }else if(!user[0]){
                    console.log('INSIDE OF THE NO EMAIL FAIL')
                    return done(null, false)
                }else{
                    bcrypt.compare(password, user[0].password).then(valid => {
                        console.log('INSIDE OF THE COMPARE')
                        if(valid){
                            return done(null, user[0])
                        }else{
                            return done(null, false)
                        }
                    })
                }
            }
        })
    }
))
// Adds user obj from DB to req.session.user
passport.serializeUser((user, done) => {
    console.log('SERIALIZING')
    done(null, user);
})
// Adds created userObj w/trails wishlist to req.user, including DB user object properties
passport.deserializeUser((user, done) => {
    console.log('deSERIALIZING')
    db.query('SELECT * FROM trails WHERE trail_id IN (SELECT trail_id FROM wishlist WHERE user_id = ? AND completed = 0)', [user.user_id], (err, trails) => {
        if(err){
            console.log('Error inside the DESERIALIZE DB Call: ', err)
            done(null, false);
        }else{
            db.query('SELECT c.*, t.name, t.img_sq_small, t.img_medium FROM completed c JOIN trails t on t.trail_id = c.trail_id WHERE t.trail_id IN (SELECT c.trail_id FROM completed c WHERE user_id = ?);', [user.user_id], (err, completed_trails) => {
                if(err){
                    console.log('Error fetching User\'s completed trails: ', err)
                }else{
                    let userObj = {
                        ...user
                        , wishlist: JSON.parse(JSON.stringify(trails))
                        , completed: JSON.parse(JSON.stringify(completed_trails))
                    }
                    delete userObj.password
                    done(null, userObj);
                }
            })
        }
    })
})

authRouter.post('/login', passport.authenticate('local'
        , {
            // successRedirect: '/users/dashboard',
            failureRedirect: '/login/fail?message=Incorrect login credentials. Please try again or signup if you do not have an account yet.'
        }
    ), (req, res) => {
            console.log('Prepare for Success Redirect from Authenticate')
            res.sendStatus(200)
        }
)
authRouter.post('/signup', passport.authenticate('local', {
            successRedirect: '/users/dashboard'
            , failureRedirect: '/login/fail?message=Incorrect login credentials. Please try again or signup if you do not have an account yet.'
        }
    )
)
authRouter.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})
module.exports = authRouter