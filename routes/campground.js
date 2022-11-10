const express = require("express");
const router = express.Router();
const campgroundController = require('../controllers/campgroundController');
const {isLoggedIn, validateCampground, isAuthor} = require('../middleware');


// route for showing all the campground list and their location and description.
router.get('/', campgroundController.renderIndex);
// here we are hitting the route for getting a form to add new campground.
router.get('/new', isLoggedIn , campgroundController.newCampground);

// hitting the route for getting the values from the new form that we send previously
router.post('/',isLoggedIn,validateCampground, campgroundController.createNewCampground);
// hitting the route for getting the campground by its id that is assigned by mongodb.
router.get('/:id', campgroundController.showCampground);
// hitting the route for editting the campground. And sending edit.ejs form file in the response.
router.get('/:id/edit', isAuthor, isLoggedIn, campgroundController.editCampground);
// hitting the route to update the details that are edited by the edititing route.
router.put('/:id',isAuthor,validateCampground, isLoggedIn, campgroundController.putEditedCampground);
// hitting the route to delete the campground.
router.delete('/:id',isAuthor,isLoggedIn, campgroundController.deleteCampground);

module.exports = router;