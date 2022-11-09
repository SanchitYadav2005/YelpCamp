const express = require('express');
const router = express.Router({mergeParams:true});
const Campground = require('../models/campgrounds');
const Review = require('../models/reviews');
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, validateReview} = require('../middleware');




// route for adding the reviews to the campground
router.post('/', validateReview, isLoggedIn, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    // creting new review.
    const review = new Review(req.body.review);
    review.author = req.user._id;
    // pushing it in the campground schema.
    campground.review.push(review)
    // saving the schema
    await review.save();
    // saving the campground.
    await campground.save();
    req.flash('success', 'successfully created new reviews.');
    res.redirect(`/campgrounds/${campground._id}`);
}))
router.delete('/:reviewId', isLoggedIn, catchAsync(async(req,res)=>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {review: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'successfully deleted review.');
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;