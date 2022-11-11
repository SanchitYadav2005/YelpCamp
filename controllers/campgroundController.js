const Campground = require('../models/campgrounds');
const catchAsync = require('../utils/catchAsync');

module.exports.renderIndex = catchAsync(async (req, res) => {
    // finding the campground .find({}) funciton finds all the avliable campgrounds.
    const campgrounds = await Campground.find({});
    // rendering the index page and parsing the campgrounds to the index page.
    res.render('campgrounds/index', { campgrounds })
});
// here we are hitting the route for getting a form to add new campground.
module.exports.newCampground = (req, res) => {
    res.render('campgrounds/new');
}

// hitting the route for getting the values from the new form that we send previously

module.exports.createNewCampground = catchAsync(async (req, res, next) => {
    // created new campground using the Campground schema and the details that we get from post request are stored in requests body =>> req.body
    const campground = new Campground(req.body);
    // we are defining author to be the current user who created the campground.
    campground.author = req.user._id;
    // saved campground.
    await campground.save();
    // adding flash messages
    req.flash('success', 'successfully created new campground.');
    res.redirect(`/campgrounds/${campground._id}`)
});

// hitting the route for getting the campground by its id that is assigned by mongodb.

module.exports.showCampground = catchAsync(async (req, res,) => {
    const {id} = req.params;
    // finding the campground by its id.
    //Mongoose has a more powerful alternative called populate(), which lets you reference documents in other collections.
    // used nested populate to populate author on review schema.
    const campground = await Campground.findById(id).populate({
        path: 'review',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!campground){
        req.flash('error', 'campground is not find.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
});


// hitting the route for editting the campground. And sending edit.ejs form file in the response.

module.exports.editCampground = catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground){
        req.flash('error', 'campground is not find.');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
});

// hitting the route to update the details that are edited by the edititing route.

module.exports.putEditedCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    // updating the campground details.
    const campground = await Campground.findByIdAndUpdate(id, req.body);
    req.flash('success', 'successfully edited campground.');
    res.redirect(`/campgrounds/${campground._id}`)
});

// hitting the route to delete the campground.

module.exports.deleteCampground = catchAsync(async (req, res) => {
    const { id } = req.params;
    // deleting the campground.
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'successfully deleted campground.')
    res.redirect('/campgrounds');
});