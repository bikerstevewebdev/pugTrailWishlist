module.exports = {
    authenticate: (req, res, next) => {
        db.query('SELECT * FROM users WHERE user_id = ?', [req.user.user_id]).then(user => {
            if(user.is_admin){
                return next()
            }else{
                req.flash('user', "Unauthorized User Request: You must be an administrator to do that.")
                res.redirect(403, '/login')
            }
            next()
        })
    }
}
    