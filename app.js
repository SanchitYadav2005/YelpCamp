const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');

const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');

const campground = require('./routes/campground');
const review = require('./routes/review');

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

// using the routes.
app.use('/campgrounds', campground);
app.use('/campgrounds/:id/reviews', review);



app.get('/', (req, res) => {
    res.render('home')
});




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