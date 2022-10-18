const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { campgroundSchema, reviewSchema } = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Campground = require('./models/campgrounds');
const Review = require('./models/reviews');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        // error.details tells little more about the error and we maped over it to find the message, with the help of join() function we joined all other info about the error using (,)
        const msg = error.details.map(el => el.message).join(',')
        // we throws the error using ExpressError class that we creadte in utls folder. Where we decided the template the how the error is going to be display.
        throw new ExpressError(msg, 400)
    } else {
        // we are calling the next route to be ran if there is no error.
        next();
    }
}
// did same thing for validating reviews as to validating campground.
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home')
});
// route for showing all the campground list and their location and description.
app.get('/campgrounds', catchAsync(async (req, res) => {
    // finding the campground .find({}) funciton finds all the avliable campgrounds.
    const campgrounds = await Campground.find({});
    // rendering the index page and parsing the campgrounds to the index page.
    res.render('campgrounds/index', { campgrounds })
}));
// here we are hitting the route for getting a form to add new campground.
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

// hitting the route for getting the values from the new form that we send previously
app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {
    // created new campground using the Campground schema and the details that we get from post request are stored in requests body =>> req.body
    const campground = new Campground(req.body);
    // saved campground.
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))
// hitting the route for getting the campground by its id that is assigned by mongodb.
app.get('/campgrounds/:id', catchAsync(async (req, res,) => {
    // finding the campground by its id.
    //Mongoose has a more powerful alternative called populate(), which lets you reference documents in other collections.
    const campground = await Campground.findById(req.params.id).populate('review')
    res.render('campgrounds/show', { campground });
}));
// hitting the route for editting the campground. And sending edit.ejs form file in the response.
app.get('/campgrounds/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campgrounds/edit', { campground });
}))
// hitting the route to update the details that are edited by the edititing route.
app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    // updating the campground details.
    const campground = await Campground.findByIdAndUpdate(id, req.body);
    res.redirect(`/campgrounds/${campground._id}`)
}));
// hitting the route to delete the campground.
app.delete('/campgrounds/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    // deleting the campground.
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}));
// route for adding the reviews to the campground
app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    // creting new review.
    const review = new Review(req.body.review);
    // pushing it in the campground schema.
    campground.review.push(review)
    // saving the schema
    await review.save();
    // saving the campground.
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))


// universal route for errors.
app.all('*', (req, res, next) => {
    // this will throw the error if any route will not be matched.
    next(new ExpressError('Page Not Found', 404))
})
// this is the middleware to handle the error that are being created by the user or any unfilled deatials like review, rating.
app.use((err, req, res, next) => {
    // seted the defauld status code
    const { statusCode = 500 } = err;
    // handler for if there is no error message in the error it will send the default error that has been set.
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})
// listenning to the server.
app.listen(3000, () => {
    console.log('Serving on port 3000')
})