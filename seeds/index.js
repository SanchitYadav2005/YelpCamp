const mongoose = require("mongoose");
const Campground = require('../models/campgrounds');
const cities = require('./cities');
const {descriptors, places} = require('./seedHelper');

mongoose.connect('mongodb://localhost:27017/yelp-camp')
    

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection: error"));
db.once("oper", ()=>{
    console.log("DATABASE IS WORKING");
})

const sample = array => array[Math.floor(Math.random()*array.length)];

const seedDB = async () => {
     await Campground.deleteMany({});
     for(let i = 0; i <= 50; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const camp = new Campground({
            title: `${cities[random1000].city}, ${cities[random1000].state}`,
            location: `${sample(descriptors)} ${sample(places)}`
        });
        await camp.save();
     }
}

seedDB().then(()=>{
    mongoose.connection.close();
})