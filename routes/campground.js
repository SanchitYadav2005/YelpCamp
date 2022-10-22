const express = require("express");
const router = express.Router();
const {campgroundSchema} = require('../schemas');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campgrounds');






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


// route for showing all the campground list and their location and description.
router.get('/', catchAsync(async (req, res) => {
    // finding the campground .find({}) funciton finds all the avliable campgrounds.
    const campgrounds = await Campground.find({});
    // rendering the index page and parsing the campgrounds to the index page.
    res.render('campgrounds/index', { campgrounds })
}));
// here we are hitting the route for getting a form to add new campground.
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
})

// hitting the route for getting the values from the new form that we send previously
router.post('/', validateCampground, catchAsync(async (req, res, next) => {
    // created new campground using the Campground schema and the details that we get from post request are stored in requests body =>> req.body
    const campground = new Campground(req.body);
    // saved campground.
    await campground.save();
    // adding flash messages
    req.flash('success', 'successfully created new campground.');
    res.redirect(`/campgrounds/${campground._id}`)
}))
// hitting the route for getting the campground by its id that is assigned by mongodb.
router.get('/:id', catchAsync(async (req, res,) => {
    // finding the campground by its id.
    //Mongoose has a more powerful alternative called populate(), which lets you reference documents in other collections.
    const campground = await Campground.findById(req.params.id).populate('review');
    if(!campground){
        req.flash('error', 'campground is not find.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));
// hitting the route for editting the campground. And sending edit.ejs form file in the response.
router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error', 'campground is not find.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}))
// hitting the route to update the details that are edited by the edititing route.
router.put('/:id', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    // updating the campground details.
    const campground = await Campground.findByIdAndUpdate(id, req.body);
    req.flash('success', 'successfully edited campground.');
    res.redirect(`/campgrounds/${campground._id}`)
}));
// hitting the route to delete the campground.
router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    // deleting the campground.
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'successfully deleted campground.')
    res.redirect('/campgrounds');
}));

module.exports = router;