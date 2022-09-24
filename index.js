const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const ejs = require('ejs');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreteIndex: true,
    
})
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req,res)=>{
    res.render('home')
})

app.listen(port, (err)=>{
    if(err){
        console.log(err);
        console.log("error");
    }else{
        console.log("working");
    }
})