const User = require("../models/user.js");

module.exports.renderSingupForm = (req,res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async(req,res,next)=>{
    try {
        let{username,email,password}=req.body;
        const newUser = new User({email,username});
        let registeredUser = await User.register(newUser,password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to WanderLodge, Signed Up & Logged in successfully!");
            res.redirect("/listings");
        })
    } catch (e) {
        req.flash("error",e.message);
        res.redirect("/signup");
    }   
    
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
};

module.exports.login = async(req,res)=>{
    req.flash("success","Logged In Successfully, Welcome back to WanderLodge!");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);  
};

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You have logged out successfully!")
        res.redirect("/listings");
    });
};