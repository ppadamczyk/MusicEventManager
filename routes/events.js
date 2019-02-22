var express = require("express");
var router  = express.Router();
var passport = require("passport");
var Event = require("../models/event");
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
            console.log(newlyCreated);
            res.redirect("/events/marketplace");
        }
    });
});

router.get("/events/marketplace", middleware.isLoggedIn, function(req, res) {
    res.render("events/marketplace");
});



module.exports = router;