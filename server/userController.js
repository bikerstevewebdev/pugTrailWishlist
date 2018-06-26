require('dotenv').config()
const bcrypt          = require('bcrypt')
    , { SALT_ROUNDS } = process.env
    , db              = require('./db')

module.exports = {
    createUser: (req, res, next) => {
        const { username, fullname, password, email } = req.body
        bcrypt.genSalt(SALT_ROUNDS/1, (err, salt) => {
            if(err){
                console.log('Salt Error: ', err)
            }else{
                bcrypt.hash(password, salt, (err, hash) => {
                    if(err){
                        console.log('Hash Error: ', err)
                        db.any(`INSERT INTO users (username, fullname, email, password) values ($1, $2, $3, $4, $5)`, [username, fullname, email, hash]).then((data) => {
                            req.session.user = {
                                username: data.username,
                                email: data.email,
                                is_logged_in: true,
                                max_age: 24*604*60*100
                            }
                        }).catch(err => {
                            console.log('DB Error: ', err)
                        })
                    }else{
                        console.log('Hash: ', hash, 'Salt: ', salt)
                        res.redirect('/dashboard')
                    }
                })
            }
        })
    },

    login: (req, res, next) => {
        bcrypt.compare(PT_PASS, hash).then(valid => {
            if(valid){
                res.redirect('/dashboard')
            }else{
                req.flash('Incorrect Password')
            }
        })
    }
}