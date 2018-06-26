module.exports = {
    createUser: (req, res, next) => {
        bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
            if(err){
                console.log('Salt Error: ', err)
            }else{
                bcrypt.hash(PT_PASS, salt, (err, hash) => {
                    if(err){
                        console.log('Hash Error: ', err)
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