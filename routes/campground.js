const express = require("express");
const router = express.Router();
const campgroundController = require('../controllers/campgroundController');
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware');
const {storage} = require('../cloudinary/index')
// Multer is a node.js middleware for handling multipart/form-data, which is primarily used for uploading files. It is written on top of busboy for maximum efficiency.
const multer = require('multer');
const upload = multer({storage})


//Returns an instance of a single route which you can then use to handle HTTP verbs with optional middleware. Use router.route() to avoid duplicate route naming and thus typing errors.



router.route('/')
    // route for showing all the campground list and their location and description.
    .get(campgroundController.renderIndex)
    // hitting the route for getting the values from the new form that we send previously
    .post(isLoggedIn,upload.array('image'),validateCampground, campgroundController.createNewCampground)
    // you need to upload imgages before validation because multer first uploads files and then pase them into req.body and for validating we need images in req.body and req.files.
    

// here we are hitting the route for getting a form to add new campground.
router.get('/new', isLoggedIn , campgroundController.newCampground);

router.route('/:id')
    // hitting the route for getting the campground by its id that is assigned by mongodb.
    .get(campgroundController.showCampground)
    // hitting the route to update the details that are edited by the edititing route.
    .put(isAuthor,upload.array('image'),validateCampground, isLoggedIn,campgroundController.putEditedCampground)
    // hitting the route to delete the campground.
    .delete(isAuthor,isLoggedIn, campgroundController.deleteCampground)


// hitting the route for editting the campground. And sending edit.ejs form file in the response.
router.get('/:id/edit', isAuthor,isLoggedIn,campgroundController.editCampground);

module.exports = router;