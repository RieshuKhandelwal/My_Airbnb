const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({accessToken: mapToken});

module.exports.listingIndex = async (req,res)=>{
    let allListings = await Listing.find({});
    res.render("listings/allListings.ejs",{allListings}); 
};

module.exports.newListingForm = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.newListingPost = async(req,res,next)=>{
    
    let response = await geocodingClient.forwardGeocode({query: req.body.listing.location,limit: 1}).send();
    let url = req.file.path;
    let filename = req.file.filename;
    let newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = {url,filename};
    newlisting.geometry = response.body.features[0].geometry;
    await newlisting.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
};

module.exports.showListing = async(req,res)=>{
    let id = req.params.id;
    let listing = await Listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested for, doesn't exist!")
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
};

module.exports.editListingForm = async(req,res)=>{
    let id = req.params.id;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for, doesn't exist!")
        return res.redirect("/listings");
    }
    let oiu = listing.image.url;
    oiu = oiu.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,oiu});
};

module.exports.editListingPatch = async(req,res)=>{
    if(!req.body.listing){
        throw new myCustomError(400,"Send valid data for updation");
    }
    let id = req.params.id;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !=="undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async(req,res)=>{
    let id = req.params.id;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};