module.exports = {
    authenticate: (req, res, next) => {
        req.session.user = !req.session.user ? { username: '', trailsWishlist: [], trailscompleted: [] } : req.session.user 
        if(req.session.user.is_logged_in){
            return next()
        }else{
            req.flash('user', "Please Login")
            res.redirect('/')
        }
        next()
    }
}
    