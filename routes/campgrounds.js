const express = require('express')
const router = express.Router()
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { isAuthor, validateCampground, isLoggedIn } = require('../middleware')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })

router.route('/')
    // All Campgrounds Page
    .get(catchAsync(campgrounds.index))
    // New Campground Endpoint
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))


// New Campground Page
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    // Campground Details Page
    .get(catchAsync(campgrounds.showCampground))
    // Edit Campground Endpoint
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    // Delete Campground Endpoint 
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

// Edit Campground Page
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router;