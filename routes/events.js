var express = require("express");
var router  = express.Router();
var passport = require("passport");
var Event = require("../models/event");
var Offer = require("../models/offer");
var middleware = require("../middleware/index");

router.get("/events/new", middleware.isLoggedIn, function(req, res) {
    res.render("events/new");
});

router.post("/events", middleware.isLoggedIn, function(req, res){
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
        if(err){
            console.log(err);
        } else {
            //redirect back to marketplace page
            res.redirect("/events/marketplace");
        }
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

module.exports = router;