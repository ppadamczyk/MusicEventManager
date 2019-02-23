var User = require("../models/user");
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};

middlewareObj.ownProfile = function(req,res,next){
    if(req.user._id.equals(req.params.id)){
        User.findById(req.params.id).populate("reviews").exec(function(err, foundUser){
        if(err){}
        res.render("users/ownProfile", {user:foundUser});
   }) ;
    }  else next();
    
};

middlewareObj.fixRoles = function(req, res, next){
    if(req.body.organizer === "organizer"){ 
        req.body.organizer = true;
    }
    if(req.body.artist ==="artist"){
        req.body.artist = true;
    }
    if(req.body.tech === "tech"){
        req.body.tech = true;
    }
    if(req.body.place_owner === "place_owner"){
        req.body.place_owner = true;
    }
    if(req.body.gear_owner === "gear_owner"){
        req.body.gear_owner = true;
    }
    return next();
};

module.exports = middlewareObj;