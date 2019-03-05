var express = require("express");
var router  = express.Router();
var mongoose = require("mongoose");
var User = require("../models/user");
var Offer= require("../models/offer");
var middleware = require("../middleware/index");


router.get("/marketplace", function(req, res){
    Offer.find({}, function(err, foundOffers){
        if(err)res.redirect("/marketplace");
        res.render("marketplace/index", {offers:foundOffers});
    });
});

router.get("/marketplace/new", middleware.isLoggedIn, function(req, res){
    res.render("marketplace/new");
});

router.post("/marketplace", middleware.isLoggedIn, function(req, res){
    User.findById(req.user._id, function(err, foundUser){
        if(err)console.log(err);
        let offer_name = req.body.offer_name;
        let type = req.body.type;
        let picture = req.body.picture;
        let description = req.body.description;
        let price = req.body.price;
        let author = {
            id: req.user._id,
            username: req.user.username
        };
        let newOffer = {offer_name: offer_name, type:type, picture:picture, description: description, price:price, author:author};
        Offer.create(newOffer, function(err, newlyCreated){
            newlyCreated.save();
            foundUser.offers.push(newlyCreated);
            foundUser.save();
            if(err)console.log(err); 
            res.redirect("/marketplace");
            });
    });
});

router.get("/marketplace/:id", function(req, res) {
    Offer.findById(req.params.id,function(err, foundOffer){
        if(err)console.log(err); 
        res.render("marketplace/show", {offer:foundOffer});
    });
});

router.get("/marketplace/:id/edit", function(req, res) {
    Offer.findById(req.params.id,function(err, foundOffer){
        if(err)console.log(err); 
        res.render("marketplace/edit", {offer:foundOffer});
    });
});

router.put("/marketplace/:id", function(req, res){
   Offer.findOneAndUpdate(req.params.id, req.body.offer, function(err, updatedOffer){
       if(err)console.log(err); 
       res.redirect("/marketplace/" + req.params.id);
   }) ;
});

router.delete("/marketplace/:id", function(req, res){
   Offer.findOneAndDelete(req.params.id, function(err){
       if(err)console.log(err); 
       res.redirect("/marketplace");
   });
});

router.get("/marketplace/:id/details", middleware.isLoggedIn, function(req, res) {
    Offer.findById(req.params.id,function(err, foundOffer){
        if(err)console.log(err); 
        res.render("marketplace/details", {offer:foundOffer, event:req.user.events.slice(-1)[0]});
    });
});

module.exports = router;