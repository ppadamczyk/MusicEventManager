var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware/index");
var Review = require("../models/review")

router.get("/users", middleware.isLoggedIn, function(req, res) {
    User.find({}, function(err, foundUsers){
        if(err){
            console.log(err);
        }
        res.render("users/index", {users:foundUsers});
    }
);
});

router.get("/users/:id", middleware.isLoggedIn, middleware.ownProfile, function(req,res){
   User.findById(req.params.id).populate("reviews").exec(function(err, foundUser){
       if(err){
       }
       res.render("users/show", {user:foundUser});
   }) ;
});

router.get("/users/:id/reviews/new", middleware.isLoggedIn, function(req,res){
   User.findById(req.params.id, function(err, foundUser){
       if(err){
           
       }
       res.render("reviews/new", {user:foundUser});
   }) ;
});

router.post("/users/:id/reviews", middleware.isLoggedIn, function(req,res){
   User.findById(req.params.id, function(err, foundUser){
       if(err){}
       var review_title = req.body.title;
       var review_grade = req.body.grade;
       var review_text = req.body.text;
       var author = {
            id: req.user._id,
            username: req.user.username
        };
        
        var newReview = {title: review_title, text: review_text, grade: review_grade, author:author};
        Review.create(newReview, function(err, newlyCreated){
            newlyCreated.save();
            foundUser.reviews.push(newlyCreated);
            foundUser.save();
            if(err){
                console.log(err);
            }
            console.log(newlyCreated);
            res.redirect("/users/"+req.params.id);
        });
   }) ;
});

router.get("/users/:id/roles", middleware.isLoggedIn, middleware.isOwnProfile, function(req, res) {
    User.findById(req.params.id, function(err, foundUser){
        res.render("users/roles", {user:foundUser});
    });
});

router.get("/users/:id/reviews", middleware.isLoggedIn, middleware.isOwnProfile, function(req, res) {
    User.findById(req.params.id).populate("reviews").exec(function(err, foundUser){
        res.render("users/reviews", {user:foundUser});
    });
});
router.get("/users/:id/events", middleware.isLoggedIn, function(req, res) {
    User.findById(req.params.id).populate("events").exec(function(err, foundUser){
        res.render("users/events", {user:foundUser});
    });
});
router.get("/users/:id/offers", middleware.isLoggedIn, function(req, res) {
    User.findById(req.params.id).populate("offers").exec(function(err, foundUser){
        res.render("users/offers", {user:foundUser});
    });
});
module.exports = router;