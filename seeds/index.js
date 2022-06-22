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

const imagesURL = 'https://api.unsplash.com/photos/random?client_id=-rCbaHRZIQbwnwVdkMrjBtFKOupuGb_bne-wEpEBmBk&collections=3846912'


const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const image = axios.get(imagesURL)
            .then(res => {
                return res.data.urls.regular;
            })
            .catch(error => {
                console.error(error);
            });
        const newCamp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ipsam error, hic ea sint impedit nisi inventore odit repudiandae laborum quidem, molestias a sequi blanditiis. Asperiores et natus perferendis. Suscipit, sunt. Nam illum dolorum facere vitae.',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            image: 'https://images.unsplash.com/photo-1445998559126-132150395033?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMzY5MTJ8MHwxfHJhbmRvbXx8fHx8fHx8fDE2NTUwMTk4OTA&ixlib=rb-1.2.1&q=80&w=1080',
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