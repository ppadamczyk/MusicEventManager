var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware/index");

router.get("/", function(req, res){
    res.render("index");
});

router.get("/main", function(req, res){
    res.render("main");
});

router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", middleware.fixRoles, function(req, res){
    var newRoles = {
        organizer: req.body.organizer,
        artist : req.body.artist, 
        tech : req.body.tech, 
        place_owner : req.body.place_owner, 
        gear_owner : req.body.gear_owner
    };
    var newUser = new User({username: req.body.username, roles: newRoles});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            //req.flash("error", err.message);
            console.log(err);
            return res.render("register");
            
        }
        passport.authenticate("local")(req, res, function(){
           //req.flash("success", "Welcome to YelpCamp " + user.username);
           res.redirect("/main"); 
        });
    });
});

router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/main",
        failureRedirect: "/login"
    }), function(req, res){
});

router.get("/logout", function(req, res){
   req.logout();
   res.redirect("/main");
});

router.get("/about", function(req, res) {
    res.render("about");
});

module.exports = router;