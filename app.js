const express = require('express');
const session = require('express-session')
const flash = require('connect-flash')
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate')
const methodOverride = require('method-override');

const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');

const { campgroundSchema, reviewSchema } = require('./schemas');

const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

// Connecting to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
// Error handling for MonogDB Connnection
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'console error:'));
db.once('open', () => {
    console.log('Database Connected');
});

app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisismysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// Route handler
app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

// Home Route
app.get('/', (req, res) => {
    res.render('home');
});


app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found!', 404))
    // req.flash('error', '404 Page Not Found!')
    // res.redirect('/campgrounds')
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on PORT: 3000!');
})