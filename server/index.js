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
    , LocalStrategy = require('passport-local').Strategy
    , MySQLStore    = require('express-mysql-session')(session)

    // , flash         = require('express-flash')
    
    // no longer using postgres, switched to mysql but keeping this for reference
    // , pgStore       = require('connect-pg-simple')(session)
    
    // moved pgp to another file to maintain one db object but have access in multiple files
    // , pgp      = require('pg-promise')()

// comented the next line out because the view-engine set up in express takes care of this;
//   this style is used for other use-cases of pug
// const pug = require('pug')

// Here begin the seemingly redundent notes for anyone interested in the use for things in the server file.
// Advanced devs, plz excuse the sometimes pointless/obvious notes

// destructuring the environment variables for use in file without repetitive process.env
const {
    DB_PASS
    , DB_USER
    , DB_HOST
    , SESSION_SECRET
    , DB_PORT
    , DB_NAME
    , SERVER_PORT
} = process.env

const app = express()
// const db = pgp(DB_STRING)

// setting the static files (for references to the static folder) to point to the public folder
app.use('/static', express.static('public', { redirect: true}))
// express' version of body-parser to parse the data from post's and place onto req.body 
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'pug')
app.set('view cache', true)
// cors middleware for ...... cors. Duh
app.use(cors())
// using flash for flash messaging user with req.flash, mainly for errors
// app.use(flash())

// creating MySQL Session Store
const sessionStore = new MySQLStore({
    host: DB_HOST
    , port: DB_PORT
    , user: DB_USER
    , password: DB_PASS
    , database: DB_NAME
    , createDatabaseTable: true
    , schema: {
        tableName: 'sessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
})

// setting up session
app.use(session({
    secret: SESSION_SECRET || "ghvjhvjahbsdfuhalksdfbkhagd"
    , store: sessionStore
    , resave: false
    , saveUninitialized: true
    , cookie: {
        maxAge: 24*60*60*1000
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
    db.query('SELECT * FROM trails WHERE trail_id IN (SELECT trail_id FROM wishlist WHERE user_id = ?)', [user.user_id], (err, trails) => {
        if(err){
            console.log('Error inside the DESERIALIZE DB Call: ', err)
            done(null, false);
        }else{
            let userObj = {
                ...user
                , wishlist: JSON.parse(JSON.stringify(trails))
            }
            delete userObj.password
            done(null, userObj);
        }
    })
})

// custom top level middleware to see what is arriving on the req.body
// logging url helps debug which route has the underlying issue
// also checking the session object to see what is available
app.use((req, res, next) => {
    console.log('URL: ', req.url, 'Method: ', req.method, 'Body: ', req.body, 'Session Obj: ', req.session, 'SessionPassport User: ', req.session.passport)
    next()
})


app.post('/login', passport.authenticate('local'
        , {
            // successRedirect: '/dashboard',
            failureRedirect: '/login/fail?message=Incorrect login credentials. Please try again or signup if you do not have an account yet.'
        }
    ), (req, res) => {
            console.log('Prepare for Success Redirect from Authenticate')
            res.sendStatus(200)
        }
)
app.post('/signup', passport.authenticate('local', {
            successRedirect: '/dashboard'
            , failureRedirect: '/login/fail?message=Incorrect login credentials. Please try again or signup if you do not have an account yet.'
        }
    )
)
app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
})
// db.connect()
//     .then(obj => {
    //         console.log('DB Connection Object: ', obj)
    //     })
// will hookup later for /admin routes using route splitting
// router.use('/admin', auth.authenticate)

// simple rendering routes
app.get('/',                         routes.renderHome)
app.get('/login',                    routes.renderLogin)
app.get('/login/fail',               routes.sendFailStatus)
app.get('/signup',                   routes.renderSignup)
app.get('/users/profile',            routes.renderProfile)
app.get('/users/wishlist',           routes.renderWishlist)
app.get('/contact',                  routes.renderContact)
app.get('/about',                    routes.renderAbout)
app.get('/faq',                      routes.renderFAQ)
app.get('/dashboard',                routes.renderDashboard)
app.get('/trails',                   routes.renderTrails)
app.get('/trails/:id',               routes.renderOneTrail)
app.post('/trails/search',           routes.renderSearchResults)

app.post('/users/wishlist/add/:id',   uc.addTrailToWishlist)

// user routes
// app.post('/users', uc.createUser)
// app.post('/users/login', uc.login)

app.listen(SERVER_PORT, () => {
    console.log(`Listening with pugs on port ${SERVER_PORT}`)
})