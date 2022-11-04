const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const ExpressError = require('../utils/ExpressError');


router.get('/register', (req, res) => {
    res.render('user/register');
});

router.post('/register', catchAsync(async (req, res) => {
    try {
        // getting email, username and password from requests body.
        const { email, username, password } = req.body;
        // specifying user.
        const user = new User({ email, username });
        // registering user with the .register method that is given by passport-local-mongoose that is in our shcema
        const registeredUser = await User.register(user, password);
        // flashing success message if this works.
        req.flash('success', 'welcome to yelpcamp');
        // redirecting to campgrounds.
        res.redirect('/campgrounds');
    }catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }

}));

router.get('/login', (req,res)=>{
    res.render('user/login');
});

router.post('/login',passport.authenticate('local', {failureMessage:true, failureRedirect:'/login'}), (req,res)=>{
    req.flash('success', 'welcome back!');
    res.redirect('/campgrounds');
} );

router.get('/logout', (req,res)=>{
    req.logout((error)=>{
        if(error){
            return req.flash('error', error);
        }
        req.flash('success', 'Goodbye');
        res.redirect('/campgrounds');
    });
    
})

module.exports = router;