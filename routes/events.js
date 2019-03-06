var express = require("express");
var router = express.Router();
var passport = require("passport");
var Event = require("../models/event");
var Offer = require("../models/offer");
var middleware = require("../middleware/index");
var User = require("../models/user");
var Task = require("../models/task");

router.get("/events/new", middleware.isLoggedIn, function(req, res) {
    res.render("events/new");
});

router.post("/events", middleware.isLoggedIn, function(req, res) {
    User.findById(req.user._id, function(err, foundUser) {
        if (err) console.log(err);
        let author = {
            id: req.user._id,
            username: req.user.username
        };
        let newEvent = req.body.event;
        newEvent.author = author;
        newEvent.isFinished = false;
        Event.create(newEvent, function(err, newlyCreated) {
            newlyCreated.save();
            foundUser.events.push(newlyCreated._id);
            foundUser.save();
            if (err) {
                console.log(err);
            }
            else {
                res.redirect("/events/" + newlyCreated._id + "/marketplace");
            }
        });
    });
});

router.get("/events/:id/marketplace", middleware.isLoggedIn, function(req, res) {
    Event.findById(req.params.id).populate("contractors").exec(function(err, foundEvent) {
        if (err) console.log(err.err);
        res.render("events/marketplace", { event: foundEvent });
    });
});

router.post('/events/get', function(req, res) {
    let id = req.body.id;
    Offer.find({ type: id }, function(err, foundOffers) {
        if (err) {}
        var msg = {
            foundOffers: foundOffers
        };
        res.send(msg);
    });
});

router.get("/events/:eventid", middleware.isLoggedIn, function(req, res) {
    Event.findById(req.params.eventid).deepPopulate("contractors.contractor_id").exec(function(err, foundEvent) {
        if (err) console.log(err);
        res.render("events/show", { event: foundEvent });
    });
});

router.get("/events/:id/tasks/new", middleware.isLoggedIn, function(req, res) {
    Event.findById(req.params.id, function(err, foundEvent) {
        if (err) console.log(err);
        res.render("events/tasks/new", { event: foundEvent });
    });
});

router.post("/events/:id/tasks", middleware.isLoggedIn, function(req, res) {
    let newTask = req.body.task;
    newTask.author = req.user._id;
    newTask.event = req.params.id;
    Event.findById(req.params.id, function(err, foundEvent) {
        if (err) console.log(err);
        Task.create(newTask, function(err, newlyCreated) {
            if (err) console.log(err);
            newlyCreated.save();
            foundEvent.tasks.push(newlyCreated._id);
            foundEvent.save();
            res.redirect("/events/" + req.params.id + "/manage");
        });
    });
});

router.get("/events/:id/manage", middleware.isLoggedIn, function(req, res) {
    Event.findById(req.params.id).populate("contractors.contractor_id tasks").exec(function(err, foundEvent) {
        if (err) console.log(err);
        res.render("events/manage", { event: foundEvent });
    });
});

router.get("/events/:id/done", function(req, res) {
    Event.findById(req.params.id, function(err, foundEvent) {
        if (err) console.log(err);
        foundEvent.isFinished = true;
        foundEvent.save();
        res.redirect("/events/" + req.params.id + "/manage");
    });
});

router.get("/events/:event_id/:offer_id", middleware.isLoggedIn, function(req, res) {

    Event.findById(req.params.event_id, function(err, foundEvent) {
        if (err) console.log(err);

        Offer.findById(req.params.offer_id, function(err, foundOffer) {
            if (err) console.log(err);

            User.findById(foundOffer.author.id, function(err, foundUser) {
                if (err) console.log(err);

                let newContractor = {
                    contractor_id: foundOffer.author.id,
                    role: foundOffer.type,
                    isConfirmed: false
                };
                foundEvent.contractors.push(newContractor);
                foundEvent.save();

                let newContract = {
                    contract_id: foundEvent._id,
                    role: foundOffer.type,
                    isConfirmed: false
                };

                foundUser.contracts.push(newContract);
                foundUser.save();
                res.redirect("/events/" + req.params.event_id + "/marketplace");
            });
        });
    });
});

module.exports = router;
