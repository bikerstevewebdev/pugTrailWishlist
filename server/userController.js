require('dotenv').config()
const bcrypt          = require('bcrypt')
    , { SALT_ROUNDS } = process.env
    , db              = require('./db')

module.exports = {
    createUser: (body, username, password, next) => {
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
                        db.any(`INSERT INTO users (username, fullname, email, password) values ($1, $2, $3, $4); SELECT * FROM users WHERE username = $1;`, [username, fullname, email, hash]).then(newUser => {
                            next(null, newUser[0])
                        }).catch(err => {
                            console.log('DB Error: ', err)
                            next(null, false)
                        })
                    }
                })
            }
        })
    },
    // createUser: (req, res, next) => {
    //     const { username, fullname, password, email } = req.body
    //     bcrypt.genSalt(SALT_ROUNDS/1, (err, salt) => {
    //         if(err){
    //             console.log('Salt Error: ', err)
    //         }else{
    //             bcrypt.hash(password, salt, (err, hash) => {
    //                 if(err){
    //                     console.log(req.body)
    //                     console.log('Hash Error: ', err)
    //                 }else{
    //                     console.log('Hash: ', hash, 'Salt: ', salt)
    //                     db.any(`INSERT INTO users (username, fullname, email, password) values ($1, $2, $3, $4)`, [username, fullname, email, hash]).then(data => {
    //                         req.session.user = {
    //                             username: data.username,
    //                             email: data.email,
    //                             is_logged_in: true,
    //                             max_age: 24*604*60*100
    //                         }
    //                         res.redirect('/users/dashboard')
    //                     }).catch(err => {
    //                         console.log('DB Error: ', err)
    //                     })
    //                 }
    //             })
    //         }
    //     })
    // },

    login: (req, res, next) => {
        const { password, username } = req.body
        db.any('select * from users where username = $1', [username]).then(data => {
            console.log('DB User Data from Login: ', data[0])
            bcrypt.compare(password, data[0].password).then(valid => {
                if(valid){
                    res.render('dashboard', { user: req.session.user, userInfo: data })
                }else{
                    req.flash('Incorrect Password')
                }
            })
        })
    }
}