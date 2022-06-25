const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('auth/register')
}

module.exports.registerUser = async (req, res, next) => {
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
}


module.exports.renderLogin = async (req, res) => {
    res.render('auth/login')
}

module.exports.loginUser = (req, res, next) => {
    req.flash('sucess', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    // console.log('Endpoint: ', req.session)
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logoutUser = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err)
        req.flash('success', 'Goodbye!')
        res.redirect('/campgrounds')
    })
}