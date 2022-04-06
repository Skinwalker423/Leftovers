const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash('error', 'Please sign in to do that');
        req.session.returnTo = req.originalUrl;
        res.redirect('/login');
    }
}

module.exports = isLoggedIn;