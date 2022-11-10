const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');


// route to get registration form.
module.exports.getRegistrationPage = (req, res) => {
    res.render('user/register');
};

// route to create user.
module.exports.createUser = catchAsync(async (req, res, next) => {
    try {
        // getting email, username and password from requests body.
        const { email, username, password } = req.body;
        // specifying user.
        const user = new User({ email, username });
        // registering user with the .register method that is given by passport-local-mongoose that is in our shcema
        const registeredUser = await User.register(user, password);
        // logining in the user after registering.
        req.login(registeredUser, err => {
            if (err) return next(err); 
            // flashing success message if this works.
            req.flash('success', 'welcome to yelpcamp');
            // redirecting to campgrounds.
            res.redirect('/campgrounds');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }

});

// route to get login form.

module.exports.getLoginForm = (req, res) => {
    res.render('user/login');
}

module.exports.loginUser =  (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
    req.logout((error) => {
        if (error) {
            return req.flash('error', error);
        }
        req.flash('success', 'Goodbye');
        res.redirect('/campgrounds');
    });

};