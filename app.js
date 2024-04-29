if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const cookieParser = require('cookie-parser');
const ejsMate = require("ejs-mate");
const myCustomError = require("./utils/myCustomError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');      //express-session is required for connect-mongo
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");  


const listingsRouter = require("./routes/listings.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,"public")));
app.use(methodOverride("_method"));

app.engine("ejs",ejsMate);

// "mongodb://127.0.0.1:27017/wanderlodge" - former DB url
const dburl = process.env.ATLASDB_URL;
async function main(){
    await mongoose.connect(dburl);
    
}

main()
    .then((res)=>{
        console.log("connected to mongodb successfully");
    })
    .catch((err)=>{
        console.log(err);
    });

app.get("/",(req,res)=>{
    res.redirect("/listings");
})

const store = MongoStore.create({                   //this function is use to defined store location & it's some
    mongoUrl: dburl,                                //functions for storing session information 
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24*3600,
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE", error);
})

app.use(session({                                  //this function is to initialize storing of session info
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
}));




app.use(flash());   // flash uses session, so express session should be used first. Passport also uses session.

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})



app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

//Error handling middleware
app.all("*",(req,res,next)=>{
    next(new myCustomError(404,"Page Not Found!"));
});

//Error handling middleware
app.use((err,req,res,next)=>{
    let{statusCode=500,message="Something went wrong!"} = err;
    res.status(statusCode).render("error.ejs",{message});
})

app.listen(port,()=>{
    console.log(`app is listening on port ${port}`);
})
