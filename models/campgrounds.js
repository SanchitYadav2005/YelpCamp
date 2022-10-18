const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require('./reviews');

const CampgroundSchem = new Schema({
    title:String,
    price: Number,
    image:String,
    description: String,
    location: String,
    // refrenceing campground model to review model to attach every review to its campgorund and user.
    review: [
        {
            // type will be set to objectid.
            type: Schema.Types.ObjectId,
            // setting the reference to Review model"
            ref: 'Review'
        }
    ]
});

CampgroundSchem.post('findOneAndDelete', async(doc)=>{
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.review
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchem);