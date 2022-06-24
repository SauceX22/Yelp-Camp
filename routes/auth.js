const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const ExpressError = require('../utils/ExpressError');
const { userSchema, reviewSchema } = require('../schemas');
const passport = require('passport')

// Registration Form
router.get('/register', (req, res) => {
    res.render('auth/register')
})

// Register Endpoint
router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username })
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, (err) => {
            if (err) return next(err)
            req.flash('success', 'Welcome to Yelp Camp!')
            res.redirect('/campgrounds')
        })
    } catch (err) {
        console.log(err)
        req.flash('error', err.message)
        res.redirect('/register')
    }
}))

// Login Form
router.get('/login', async (req, res) => {
    console.log('============================================================================')
    console.log('Login Form: ', req.session)
    res.render('auth/login')
})


// Login Endpoint
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res, next) => {
    req.flash('sucess', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    // console.log('Endpoint: ', req.session)
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err)
        req.flash('success', 'Goodbye!')
        res.redirect('/campgrounds')
    })
})

module.exports = router;