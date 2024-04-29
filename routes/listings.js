const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const myCustomError = require("../utils/myCustomError.js");
const wrapAsync = require("../utils/wrapAsync.js");
const {listingSchema} = require("../schema.js");
const {isOwner,isLoggedIn} = require("../middleware.js");
const multer = require("multer");               // to parse form format into enctype="multipart/form-data"
const {storage}= require("../cloudConfig.js");  // import cloudinary & cloud storage details
const upload = multer({storage});               // multer using cloud storage to store files(img) of Listings

const listingController = require("../controllers/listing.js");

//server-side listings validator (if we directly send post req from postman or hoppscotch directly with anydata or without data in body then this will throw new error using joi.) 
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new myCustomError(400,errMsg);
    }else{
        next();
    }
};


// all listings route
router.get("/", wrapAsync(listingController.listingIndex));

//create route

router.route("/new")
    .get(isLoggedIn,listingController.newListingForm)
    .post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.newListingPost));

router.route("/:id")
    .get(wrapAsync(listingController.showListing)) //show route
    .patch(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.editListingPatch)) //edit put/patch route
    .delete(isLoggedIn,isOwner, wrapAsync(listingController.deleteListing)); //delete route


//Edit render route

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListingForm));

module.exports = router;