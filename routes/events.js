var express = require("express");
var router  = express.Router();
var passport = require("passport");
var Event = require("../models/event");
var Offer = require("../models/offer");
var middleware = require("../middleware/index");
var User = require("../models/user");
var Task = require("../models/task");

router.get("/events/new", middleware.isLoggedIn, function(req, res) {
    res.render("events/new");
});

router.post("/events", middleware.isLoggedIn, function(req, res){
    User.findById(req.user._id).populate("events").exec(function(err, foundUser){
        if(err){
            console.log(err);
        }
        var event_name = req.body.event_name;
        var picture = req.body.picture;
        var description = req.body.description;
        var author = {
            id: req.user._id,
            username: req.user.username
        };
        var keepUser = foundUser;
        var newEvent = {event_name: event_name, picture:picture, description: description, author:author, isFinished:false};
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
    Event.findById(req.params.id).populate("contractors.artists contractors.techs contractors.gear_owners contractors.place_owner").exec(function(err, foundEvent) {
        if(err){
            console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA" + err);
        }
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

router.get("/events/:eventid", middleware.isLoggedIn, function(req, res) {
    console.log(req.params.eventid);
    Event.findById(req.params.eventid).deepPopulate('contractors.artists contractors.techs contractors.gear_owners contractors.place_owner').exec(function(err, foundEvent) {
        if(err){
            console.log(err);
        }
        console.log(foundEvent);
        res.render("events/show", {event:foundEvent});
    });
});

router.get("/events/:id/tasks/new", middleware.isLoggedIn, function(req, res) {
    Event.findById(req.params.id, function(err, foundEvent) {
        if(err){
            console.log(err);
        }
        res.render("events/tasks/new", {event:foundEvent});
    });
});

router.post("/events/:id/tasks", middleware.isLoggedIn, function(req, res){
    let newTask = req.body.task;
    newTask.author = req.user._id;
    Event.findById(req.params.id, function(err, foundEvent){
        if(err){
            console.log(err);
        }
        Task.create(newTask, function(err, newlyCreated){
            if(err){
                console.log(err);
            }
            newlyCreated.save();
            foundEvent.tasks.push(newlyCreated._id);
            foundEvent.save();
            res.redirect("/events/"+req.params.id+"/manage");
        });
    });
});

router.get("/events/:id/manage", middleware.isLoggedIn, function(req, res) {
    Event.findById(req.params.id).deepPopulate("contractors.artists contractors.techs contractors.gear_owners contractors.place_owner tasks").exec(function(err, foundEvent){
        if(err){
            console.log(err);
        }
        res.render("events/manage", {event:foundEvent});
    });
});

router.get("/events/:id/done", function(req, res){
    Event.findById(req.params.id, function(err, foundEvent) {
        if(err) console.log(err);
        foundEvent.isFinished = true;
        foundEvent.save();
        res.redirect("/events/"+req.params.id+"/manage");
    });
});

router.get("/events/:event_id/:offer_id", middleware.isLoggedIn, function(req, res) {
    Offer.findById(req.params.offer_id,function(err, foundOffer) {
        if(err){
            console.log(err);
        }
        var offer = foundOffer;
        Event.findById(req.params.event_id,function(err, foundEvent){
            if(err)console.log(err);
            if(offer.type=="artist") foundEvent.contractors.artists.push(offer.author.id);
            if(offer.type=="tech") foundEvent.contractors.techs.push(offer.author.id);
            if(offer.type=="gear_owner") foundEvent.contractors.gear_owners.push(offer.author.id);
            if(offer.type=="place_owner") foundEvent.contractors.place_owner=offer.author.id;
            foundEvent.save();
            res.redirect("/events/"+req.params.event_id+"/marketplace");
        });
    });
});

module.exports = router;