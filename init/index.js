const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlodge");
}

main()
    .then((res)=>{
        console.log("connected to mongodb successfully");
    })
    .catch((err)=>{
        console.log(err);
    });

const initDB = async()=>{
    await Listing.deleteMany({});
    initData.data =  initData.data.map((obj)=>({
        ...obj,
        owner:"662d1bb2e73c922a570593e2",
    }));
    await Listing.insertMany(initData.data);
    console.log('data was initialized');
}
initDB();

