require('dotenv').config()
const express       = require('express')
    , path          = require('path')
    , router        = express.Router()
    , auth          = require('./authentication')
    , db            = require('./db')
    , bcrypt        = require('bcrypt')
    , uc            = require('./userController')
    , session       = require('express-session')
    , tc            = require('./apis/trails')
    , cors          = require('cors')
    , axios         = require('axios')
    , passport      = require('passport')
    , routes        = require('./routes')
    , flash         = require('express-flash')
    , LocalStrategy = require('passport-local').Strategy
    , pgStore       = require('connect-pg-simple')(session)
    // moved pgp to another file to maintain one db object but have access in multiple files
    // , pgp      = require('pg-promise')()

// comented the next line out because the view-engine set up in express takes care of this;
//   this style is used for other use-cases of pug
// const pug = require('pug')

// Here begin the seemingly redundent notes for anyone interested in the use for things in the server file.
// Advanced devs, plz excuse the sometimes pointless/obvious notes

// destructuring the environment variables for use in file without repetitive process.env
const {
    DB_STRING
    , SALT_ROUNDS
    , PT_PASS
    , SESSION_SECRET
    , API_KEY
} = process.env

const app = express()
// const db = pgp(DB_STRING)

// setting the static files (for references to the static folder) to point to the public folder
app.use('/static', express.static('public'))
// express' version of body-parser to parse the data from post's and place onto req.body 
app.use(express.json())
// cors middleware for ...... cors. Duh
app.use(cors())
// using flash for flash messaging user with req.flash, mainly for errors
app.use(flash())

// setting up session
app.use(session({
    secret: SESSION_SECRET || "ghvjhvjahbsdfuhalksdfbkhagd"
    , store: new pgStore({ conString: DB_STRING})
    , resave: false
    , saveUninitialized: true
    , cookie: {
        maxAge: 24*60*60*100
    }
}))

// setting up passport to.... 
app.use(passport.initialize())
// .... handle sessions:
app.use(passport.session())

// using local strategy for custom login handling
passport.use(new LocalStrategy(
    { passReqToCallback: true }
    , function(req, username, password, done) {
        console.log('INSIDE OF PASSPORT STRATEGY')
        db.any('SELECT * from users WHERE username = $1', [username]).then(user => {
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
        })
    }
))
// Adds user obj from DB to req.session.user
passport.serializeUser((user, done) => {
    done(null, user);
})
// Adds created userObj w/trails wishlist to req.user, including DB user object properties
passport.deserializeUser((user, done) => {
    db.any('SELECT * FROM trails WHERE trail_id IN (SELECT trail_id FROM wishlist WHERE user_id = $1)', [user.user_id]).then(trails => {
        let userObj = {
            ...user
            , wishlist: trails
        }
        done(null, userObj);
    })
})

// custom top level middleware to see what is arriving on the req.body
// logging url helps debug which route has the underlying issue
// also checking the session object to see what is available
app.use((req, res, next) => {
    console.log('URL: ', req.url, 'Body: ', req.body, 'Session Obj: ', req.session, 'Session User: ', req.session.user)
    next()
})
app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'pug')


app.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard'
    , failureRedirect: '/login'
    , failureFlash: 'Invalid login credentials. Please try again.'
}))
// db.connect()
//     .then(obj => {
    //         console.log('DB Connection Object: ', obj)
    //     })
// will hookup later for /admin routes using route splitting
// router.use('/admin', auth.authenticate)

// simple rendering routes
app.get('/',                 routes.renderHome)
app.get('/login',            routes.renderLogin)
app.get('/signup',           routes.renderSignup)
app.get('/contact',          routes.renderContact)
app.get('/about',            routes.renderAbout)
app.get('/faq',              routes.renderFAQ)
app.get('/dashboard',        routes.renderDashboard)
app.get('/suggestions/form', routes.renderSuggestion)
app.get('/trails',           routes.renderTrails)
app.get('/trails/:id',       routes.renderOneTrail)

// user routes
// app.post('/users', uc.createUser)
// app.post('/users/login', uc.login)

app.listen(3123, () => {
    console.log(`Listening with pugs on port ${3123}`)
})