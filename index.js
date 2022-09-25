const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const ejs = require('ejs');
const mongoose = require('mongoose');
const Campground = require('./models/campgrounds');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error:"));
db.once('open', ()=>{
    console.log("Database connected");
});
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended:true}))

app.get('/', (req,res)=>{
    res.render('home')
});

app.get('/campgrounds', async (req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', {campgrounds});
});
app.get('/campgrounds/new', (req,res)=>{
    res.render('campgrounds/new');
});
app.post('/campgrounds', async (req,res)=>{
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds`)
    console.log(req.body.campground)
})

app.listen(port, (err)=>{
    if(err){
        console.log(err);
        console.log("error");
    }else{
        console.log("working");
    }
})