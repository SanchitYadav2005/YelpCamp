const { campgroundSchema, reviewSchema} = require('./schemas');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campgrounds');
const Review = require('./models/reviews');

module.exports.isLoggedIn = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next()
}



module.exports.validateCampground = (req, res, next) => {
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

module.exports.isAuthor = async(req, res, next) =>{
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission!');
        return res.redirect(`/campgrounds/${campground._id}`)
    }
    next();
}

module.exports.isReviewAuthor = async(req, res, next) =>{
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission!');
        return res.redirect(`/campgrounds/${id}`)
    }
    next();
}
// did same thing for validating reviews as to validating campground.
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}