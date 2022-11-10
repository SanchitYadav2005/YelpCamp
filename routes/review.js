const express = require('express');
const router = express.Router({mergeParams:true});
const reviewController = require('../controllers/reviewController');
const {isLoggedIn, validateReview, isReviewAuthor} = require('../middleware');




// route for adding the reviews to the campground
router.post('/', validateReview, isLoggedIn, reviewController.createReview);

// route for deleting review.
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, reviewController.deleteReview);

module.exports = router;