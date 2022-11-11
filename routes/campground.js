const express = require("express");
const router = express.Router();
const campgroundController = require('../controllers/campgroundController');
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware');
// Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. It is written on top of busboy for maximum efficiency.
const multer = require('multer');


//Returns an instance of a single route which you can then use to handle HTTP verbs with optional middleware. Use router.route() to avoid duplicate route naming and thus typing errors.

router.route('/')
    // route for showing all the campground list and their location and description.
    .get('/', campgroundController.renderIndex);



router


// hitting the route for getting the values from the new form that we send previously
router.post('/',isLoggedIn,validateCampground, campgroundController.createNewCampground);
// here we are hitting the route for getting a form to add new campground.
router.get('/new', isLoggedIn , campgroundController.newCampground);
// hitting the route for getting the campground by its id that is assigned by mongodb.
router.get('/:id', campgroundController.showCampground);
// hitting the route for editting the campground. And sending edit.ejs form file in the response.
router.get('/:id/edit', isAuthor, isLoggedIn, campgroundController.editCampground);
// hitting the route to update the details that are edited by the edititing route.
router.put('/:id',isAuthor,validateCampground, isLoggedIn, campgroundController.putEditedCampground);
// hitting the route to delete the campground.
router.delete('/:id',isAuthor,isLoggedIn, campgroundController.deleteCampground);

module.exports = router;