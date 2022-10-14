const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String, // body represents review text.
    rating: Number
})

module.exports = mongoose.model("Review", reviewSchema);