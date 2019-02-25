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
    User.findById(req.user._id, function(err, foundUser){
        var event_name = req.body.event_name;
        var picture = req.body.picture;
        var description = req.body.description;
        var author = {
            id: req.user._id,
            username: req.user.username
        };
        var newEvent = {event_name: event_name, picture:picture, description: description, author:author};
        // Create a new event and save to DB
        Event.create(newEvent, function(err, newlyCreated){
            newlyCreated.save();
            foundUser.events.push(newlyCreated);
            foundUser.save();
            if(err){
                console.log(err);
            } else {
                //redirect back to marketplace page
                console.log(foundUser.events);
                res.redirect("/events/marketplace");
            }
        });
});
});

router.get("/events/marketplace", middleware.isLoggedIn, function(req, res) {
    res.render("events/marketplace");
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

router.get("/events/:id", middleware.isLoggedIn, function(req, res) {
    Event.findById(req.params.id, function(err, foundEvent){
    res.render("events/show", {event:foundEvent});
    });
});

module.exports = router;