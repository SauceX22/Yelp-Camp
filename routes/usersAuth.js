const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync');
const User = require('../models/user');
const ExpressError = require('../utils/ExpressError');
const { userSchema, reviewSchema } = require('../schemas');
const passport = require('passport')
const usersAuth = require('../controllers/usersAuth')

router.route('/register')
    // Registration Page
    .get(usersAuth.renderRegister)
    // Register Endpoint
    .post(catchAsync(usersAuth.registerUser))

router.route('/login')
    // Login Page
    .get(usersAuth.renderLogin)
    // Login Endpoint
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), usersAuth.loginUser)

// Logout Endpoint
router.get('/logout', usersAuth.logoutUser)

module.exports = router;