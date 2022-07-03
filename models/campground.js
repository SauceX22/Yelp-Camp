const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

// https://res.cloudinary.com/dodydifbc/image/upload/v1656686722/YelpCamp/lcwvsyjrxhd6dqh2cmr0.jpg
// https://res.cloudinary.com/dodydifbc/image/upload/w_200/v1656686722/YelpCamp/lcwvsyjrxhd6dqh2cmr0.jpg

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})
ImageSchema.virtual('show').get(function () {
    return this.url.replace('/upload', '/upload/w_300')
})

const opts = { toJSON: { virtuals: true } }

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

CampgroundSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
})

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);