module.exports = function(req, res, next){
    if(req.session.user.is_logged_in){
        return next()
    }else{
        req.flash('user', "Please Login")
        res.redirect('/')
    }
}