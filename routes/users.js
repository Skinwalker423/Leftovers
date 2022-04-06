const express = require("express");
const router = express.Router({mergeParams: true});
const User = require('../models/users');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const catchAsync = require('../utilities/catchAsync');
const isLoggedIn = require("../utilities/isLoggedIn");



router.get('/register', (req, res) => {
    res.render('preppers/register');
})

router.post('/register', catchAsync (async(req, res) => {
    const {username, password, email} = req.body;
    const user = await new User({username, email});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if(err){
            return next(err);
        }
    })
    console.log(registeredUser);
    res.redirect('/');
}))

router.get('/login', (req, res, next) => {
    res.render('preppers/login');
})

router.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), (req, res) => {
    const returnTo = req.session.returnTo || '/';
    req.flash('success', `Welcome back ${req.user.username}!`);
    delete req.session.returnTo;
    res.redirect(returnTo);
})

router.get('/logout', isLoggedIn, (req, res, next) => {
    req.logout();
    req.flash('success', 'You have signed out');
    res.redirect('/');
})

module.exports = router;