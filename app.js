//requireing express.
const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const ejsMate = require('ejs-mate')
const mongoose = require('mongoose');
const Campground = require('./models/campgrounds');
const method_override = require("method-override");
const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");
const {campgroundSchema, reviewSchema} = require('./models/campgrounds');
const Review = require('./models/reviews');
const { request } = require("express");


// connecting to mongodb server.
mongoose.connect('mongodb://localhost:27017/yelp-camp')

// assigning the connection to its own varable.
const db = mongoose.connection;
// setting is up for error handling
db.on("error", console.error.bind(console, "Connection error:"));
db.once('open', () => {
    console.log("Database connected");
});

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended:true}))
app.use(method_override('_method'));




const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    console.log(error);
    if(error){
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(msg, 400);
    }else{
        next()
    }
}

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/campgrounds', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}));
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});
app.post('/campgrounds', validateCampground ,catchAsync(async (req, res) => {
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}));
app.get('/campgrounds/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/show', { campground });
}));
app.get('/campgrounds/:id/delete', catchAsync(async (req, res) => {
    const campground = await Campground.findByIdAndDelete(req.params.id);
    res.redirect('/campgrounds');
}));
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground })
}));
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const {id} = req.params;
    const findAndUpdateCampground = await Campground.findByIdAndUpdate(id, req.body, { runValidators: true, new: true });
    await findAndUpdateCampground.save();
    res.redirect(`/campgrounds/${findAndUpdateCampground._id}`);
}));

//creating route for reveiws
app.post('/campgrounds/:id/reviews', validateReview ,catchAsync(async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    const review = new Review(req.body.review);
    campground.review.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.all('*', (req, res, next) => {
    next(new ExpressError("ERROR!!!!!!", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.listen(port, (err) => {
    if (err) {
        console.log(err);
        console.log("error");
    } else {
        console.log("working");
    }
})
