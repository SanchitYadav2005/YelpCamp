const express = require("express");
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campgrounds');
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware');
const { Passport } = require("passport");
const passport = require("passport");



// route for showing all the campground list and their location and description.
router.get('/', catchAsync(async (req, res) => {
    // finding the campground .find({}) funciton finds all the avliable campgrounds.
    const campgrounds = await Campground.find({});
    // rendering the index page and parsing the campgrounds to the index page.
    res.render('campgrounds/index', { campgrounds })
}));
// here we are hitting the route for getting a form to add new campground.
router.get('/new', isLoggedIn ,(req, res) => {
    res.render('campgrounds/new');
})

// hitting the route for getting the values from the new form that we send previously
router.post('/',isLoggedIn,validateCampground, catchAsync(async (req, res, next) => {
    // created new campground using the Campground schema and the details that we get from post request are stored in requests body =>> req.body
    const campground = new Campground(req.body);
    campground.author = req.user._id;
    // saved campground.
    await campground.save();
    // adding flash messages
    req.flash('success', 'successfully created new campground.');
    res.redirect(`/campgrounds/${campground._id}`)
}))
// hitting the route for getting the campground by its id that is assigned by mongodb.
router.get('/:id', catchAsync(async (req, res,) => {
    const {id} = req.params;
    // finding the campground by its id.
    //Mongoose has a more powerful alternative called populate(), which lets you reference documents in other collections.
    const campground = await Campground.findById(id).populate('review').populate('author');
    if(!campground){
        req.flash('error', 'campground is not find.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));
// hitting the route for editting the campground. And sending edit.ejs form file in the response.
router.get('/:id/edit', isAuthor, isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error', 'campground is not find.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}))
// hitting the route to update the details that are edited by the edititing route.
router.put('/:id',isAuthor,validateCampground, isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    // updating the campground details.
    const campground = await Campground.findByIdAndUpdate(id, req.body);
    req.flash('success', 'successfully edited campground.');
    res.redirect(`/campgrounds/${campground._id}`)
}));
// hitting the route to delete the campground.
router.delete('/:id',isAuthor,isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    // deleting the campground.
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'successfully deleted campground.')
    res.redirect('/campgrounds');
}));

module.exports = router;