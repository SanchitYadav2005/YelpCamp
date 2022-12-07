// wiill learn about this forward when delploying.
if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const usersRoute = require('./routes/users');
const campgroundRoute = require('./routes/campground');
const reviewRoute = require('./routes/review');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';
const MongoDBStore = require("connect-mongo")(session)

// 
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    // // useCreateIndex: true,
    useUnifiedTopology: true,
    // // useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({
    replaceWith: '_'
}))
const secret = process.env.SECRET || 'thisshouldbeabettersecret'
const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24*60*60
});

store.on("error", function(e){
    console.log("store error", e)
})

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        // secure: true, // we will add this when we deploy our site. adding https in our url by adding this.
        expires: Date.now + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
// configuring the session >
app.use(session(sessionConfig))
app.use(flash())





// Configure Passport/Passport-Local
// You should configure Passport/Passport-Local as described in the Passport Guide.

// Passport-Local Mongoose supports this setup by implementing a LocalStrategy and serializeUser/deserializeUser functions.

// you should always implement these line of code after you use the session and flash.

// passport. initialize() is a middle-ware that initialises Passport
app.use(passport.initialize());
app.use(passport.session());
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate())) // authenticate Generates a function that is used in Passport's LocalStrategy.
// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// adding middleware to flash messages.
app.use((req,res,next)=>{
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next()
})




// using the routes.
app.use('/', usersRoute);
app.use('/campgrounds', campgroundRoute);
app.use('/campgrounds/:id/reviews', reviewRoute);


app.get('/', (req, res) => {
    res.render('home')
});

// universal route for errors.
app.all('*', (req, res, next) => {
    // this will throw the error if any route will not be matched.
    next(new ExpressError('Page Not Found', 404))
})
// this is the middleware to handle the error that are being created by the user or any unfilled deatials like review, rating.
app.use((err, req, res, next) => {
    // seted the defauld status code
    const { statusCode = 500 } = err;
    // handler for if there is no error message in the error it will send the default error that has been set.
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})
// listenning to the server.

const port = process.env.PORT || 3000; // this will be automaticlly be present on heroku.
app.listen(port, () => {
    console.log(`serving on port ${port}`)
})