var express = require("express");
var router  = express.Router();
var mongoose = require("mongoose");
var User = require("../models/user");
var Offer= require("../models/offer");
var middleware = require("../middleware/index");


router.get("/marketplace", function(req, res){
    Offer.find({}, function(err, foundOffers){
        if(err){
            res.redirect("/marketplace");
        }
        res.render("marketplace/index", {offers:foundOffers});
    });
});

router.get("/marketplace/new", middleware.isLoggedIn, function(req, res){
    res.render("marketplace/new");
});

router.post("/marketplace", middleware.isLoggedIn, function(req, res){
    User.findById(req.user._id, function(err, foundUser){
    var offer_name = req.body.offer_name;
    var type = req.body.type;
    var picture = req.body.picture;
    var description = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newOffer = {offer_name: offer_name, type:type, picture:picture, description: description, price:price, author:author};
    // Create a new offer and save to DB
    Offer.create(newOffer, function(err, newlyCreated){
        newlyCreated.save();
        foundUser.offers.push(newlyCreated);
        foundUser.save();
        if(err){
            console.log(err);
        } else {
            //redirect back to marketplace page
            console.log(newlyCreated);
            res.redirect("/marketplace");
        }
    });
});
});

router.get("/marketplace/:id", function(req, res) {
    Offer.findById(req.params.id,function(err, foundOffer){
        if(err){
            console.log(err);
        }
        res.render("marketplace/show", {offer:foundOffer});
    });
});
module.exports = router;
