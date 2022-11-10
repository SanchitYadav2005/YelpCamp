const Campground = require('../models/campgrounds');
const Review = require('../models/reviews');
const catchAsync = require('../utils/catchAsync');

// route for adding the reviews to the campground
module.exports.createReview = catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    // creting new review.
    const review = new Review(req.body.review);
    // we are defining the author to be the current user who created the review.
    review.author = req.user._id;
    // pushing it in the campground schema.
    campground.review.push(review)
    // saving the schema
    await review.save();
    // saving the campground.
    await campground.save();
    req.flash('success', 'successfully created new reviews.');
    res.redirect(`/campgrounds/${campground._id}`);
});

// route for deleting review.

module.exports.deleteReview = catchAsync(async(req,res)=>{
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull: {review: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'successfully deleted review.');
    res.redirect(`/campgrounds/${id}`);
})