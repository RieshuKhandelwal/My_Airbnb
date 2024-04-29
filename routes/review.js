const express = require("express");
const router = express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const myCustomError = require("../utils/myCustomError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {reviewSchema} = require("../schema.js");
const { extend } = require("joi");
const {isReviewAuthor,isLoggedIn} = require("../middleware.js");

const reviewController = require("../controllers/review.js");

//server-side listings validator (if we directly send post req from postman or hoppscotch directly with anydata or without data in body then this will throw new error using joi.) 

const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new myCustomError(400,errMsg);
    }else{
        next();
    }
};


//Reviews post route

router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.postReview));

//Reviews delete route

router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.deleteReview));

module.exports = router;
