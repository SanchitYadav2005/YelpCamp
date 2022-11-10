const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


// route to get registration form.
router.get('/register', userController.getRegistrationPage);

// route to create user.
router.post('/register', userController.createUser);

// route to get login form.
router.get('/login', userController.getLoginForm);

// route to login user.
router.post('/login', userController.loginUser);
// route to logout user.
router.get('/logout', userController.logoutUser);

module.exports = router;