var express = require("express");
var router  = express.Router();
var passport = require("passport");
var Event = require("../models/event");
var Offer = require("../models/offer");
var middleware = require("../middleware/index");
var User = require("../models/user");

router.get("/events/new", middleware.isLoggedIn, function(req, res) {
    res.render("events/new");
});

router.post("/events", middleware.isLoggedIn, function(req, res){
    User.findById(req.user._id).populate("events").exec(function(err, foundUser){
        var event_name = req.body.event_name;
        var picture = req.body.picture;
        var description = req.body.description;
        var author = {
            id: req.user._id,
            username: req.user.username
        };
        var keepUser = foundUser;
        var newEvent = {event_name: event_name, picture:picture, description: description, author:author};
        // Create a new event and save to DB
        Event.create(newEvent, function(err, newlyCreated){
            newlyCreated.save();
            keepUser.events.push(newlyCreated._id);
            keepUser.save();
            if(err){
                console.log(err);
            } else {
                //redirect back to marketplace page
                console.log(keepUser.events);
                res.redirect("/events/" + newlyCreated._id +"/marketplace");
            }
        });
});
});

router.get("/events/:id/marketplace", middleware.isLoggedIn, function(req, res) {
    Event.findById(req.params.id).populate("contractors").exec(function(err, foundEvent) {
        res.render("events/marketplace", {event:foundEvent});
    });
});


router.post('/events/get', function(req, res) {
    let id = req.body.id;
    Offer.find({type:id}, function(err, foundOffers){
        if(err){}
        var msg = {
            foundOffers : foundOffers
        };
        res.send(msg);
    });
});

router.get("/events/:event_id/:offer_id", middleware.isLoggedIn, function(req, res) {
    Offer.findById(req.params.offer_id,function(err, foundOffer) {
        if(err){
            console.log(err);
        }
        var offer = foundOffer;
        Event.findById(req.params.event_id,function(err, foundEvent){
            if(err){
                console.log(err);
            }
            if(offer.type=="artist"){
            foundEvent.contractors.artists.push(offer.author.id);
            foundEvent.save();
            }
            if(offer.type=="tech"){
            foundEvent.contractors.techs.push(offer.author.id);
            foundEvent.save();
            }
            if(offer.type=="gear_owner"){
            foundEvent.contractors.gear_owners.push(offer.author.id);
            foundEvent.save();
            }
            if(offer.type=="place_owner"){
            foundEvent.contractors.place_owner=offer.author.id;
            foundEvent.save();
            }
            res.redirect("/events/"+req.params.event_id+"/marketplace");
        });
    });
    
});

router.get("/events/:event_id", middleware.isLoggedIn, function(req, res) {
    Event.findById(req.params.event_id).populate("contractors").exec(function(err, foundEvent){
        if(err){
            console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" +err);
        }
        res.render("events/show", {event:foundEvent});
        console.log(foundEvent);
    });
});

module.exports = router;