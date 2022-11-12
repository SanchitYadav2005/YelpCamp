const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const passport = require('passport');


router.route('/register')
    // route to get registration form.
    .get(userController.getRegistrationPage)
    // route to create user.
    .post(userController.createUser)


router.route('/login')
    // route to get login form.
    .get(userController.getLoginForm)
    // route to login user.
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo:true }), userController.loginUser)

// route to logout user.
router.get('/logout', userController.logoutUser)

module.exports = router;