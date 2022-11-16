const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require('./reviews');


const ImagesSchema = new Schema(
    {
        url: String,
        filename: String
    }
);
//In Mongoose, a virtual is a property that is not stored in MongoDB. Virtuals are typically used for computed properties on documents
ImagesSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200');
});
const CampgroundSchem = new Schema({
    title:String,
    price: Number,
    images:[ImagesSchema],
    description: String,
    location: String,
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
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