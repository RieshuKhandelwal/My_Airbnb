const { ref } = require("joi");
const mongoose = require("mongoose");
const Review = require("./review.js");


const listingSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:String,
    image: {
        url: String,
        filename: String
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Review"
        },
    ],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"  
    },
    geometry:{
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});

listingSchema.post("findOneAndDelete",async(listingData)=>{
    if(listing){
        await Review.deleteMany({_id:{$in: listingData.reviews}});
    }    
});

const Listing = mongoose.model("Listing",listingSchema);

module.exports = Listing;