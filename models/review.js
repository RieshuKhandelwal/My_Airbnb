const { ref } = require("joi");
const mongoose = require("mongoose");

// creating a schema
const reviewSchema = new mongoose.Schema({
    comment:String,
    rating:{
        type: Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
})
//creating a model(collection) using schema 
const Review = mongoose.model("Review",reviewSchema);

//eporting it so that we can use it other places where we'll write code for read(create,edit,update,delete) data for collection

module.exports = Review;