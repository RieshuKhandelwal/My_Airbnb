const { required } = require("joi");
const mongoose = require("mongoose");

const passportLocalMongoose = require("passport-local-mongoose");


const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    // rest username & password we aren't defining bcoz passport-local-mongoose will define it by default
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User",userSchema);