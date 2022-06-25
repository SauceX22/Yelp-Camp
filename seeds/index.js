const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities')
const axios = require('axios');
const { descriptors, places } = require('./seedHelp')

// Connecting to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
// Error handling for MonogDB Connnection 
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'console error:'));
db.once('open', () => {
    console.log('Database Connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const newCamp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsam error, hic ea sint impedit nisi inventore odit repudiandae laborum quidem, molestias a sequi blanditiis. Asperiores et natus perferendis. Suscipit, sunt. Nam illum dolorum facere vitae.',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            author: '62b5ff4e85f8904b3060a665',
            image: 'https://www.desktopbackground.org/p/2013/10/29/661606_natcher-wallpapers-free-download_1366x768_h.jpg',
            price
        })

        await newCamp.save();
    }
}

seedDB()
    .then(() => {
        console.log('SUCCESS: Data Fed!')
        mongoose.connection.close();
    })
    .catch((err) => {
        console.log("ERROR, Wasn't able to seed data");
        console.log(err);
    })