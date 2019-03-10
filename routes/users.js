var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware/index");
var Review = require("../models/review");
var Report = require("../models/report");
var Message = require("../models/message");

router.get("/users", middleware.isLoggedIn, function(req, res) {
    User.find({}, function(err, foundUsers) {
        if (err) console.log(err);
        res.render("users/index", { users: foundUsers });
    });
});

router.post("/reviews/:id/answer", middleware.isLoggedIn, function(req, res) {
    Review.findByIdAndUpdate(req.params.id, { answer: req.body.answer }, function(err, updatedReview) {
        if (err) console.log(err);
        res.redirect("/main");
    });
});

router.get("/users/:id", middleware.isLoggedIn, middleware.ownProfile, function(req, res) {
    User.findById(req.params.id).populate("reviews").exec(function(err, foundUser) {
        if (err) console.log(err);
        res.render("users/show", { user: foundUser });
    });
});

router.get("/users/:id/report", middleware.isLoggedIn, function(req, res) {
    User.findById(req.params.id, function(err, foundUser) {
        if (err) console.log(err);
        res.render("users/report", { user: foundUser });
    });
});

router.post("/users/:id/reports", middleware.isLoggedIn, function(req, res) {
    let newReport = req.body.report;
    newReport.author = {
        id: req.user._id,
        username: req.user.username
    };
    newReport.target = req.params.id;
    Report.create(newReport, function(err, newlyCreated) {
        newlyCreated.save();
        res.render("main");
    });
});

router.get("/users/:id/reviews/new", middleware.isLoggedIn, function(req, res) {
    User.findById(req.params.id, function(err, foundUser) {
        if (err) console.log(err);
        res.render("reviews/new", { user: foundUser });
    });
});

router.post("/users/:id/reviews", middleware.isLoggedIn, function(req, res) {
    User.findById(req.params.id, function(err, foundUser) {
        if (err) console.log(err);
        let newReview = req.body.review;
        newReview.author = {
            id: req.user._id,
            username: req.user.username
        };
        Review.create(newReview, function(err, newlyCreated) {
            newlyCreated.save();
            foundUser.reviews.push(newlyCreated);
            foundUser.save();
            if (err) console.log(err);
            res.redirect("/users/" + req.params.id);
        });
    });
});

router.get("/users/:id/roles", middleware.isLoggedIn, middleware.isOwnProfile, function(req, res) {
    User.findById(req.params.id, function(err, foundUser) {
        if (err) console.log(err);
        res.render("users/roles", { user: foundUser });
    });
});

router.put("/users/:id/roles", middleware.isLoggedIn, function(req, res) {
    User.findByIdAndUpdate(req.params.id, { roles: req.body.roles }, function(err, updatedUser) {
        res.redirect("/users/" + req.params.id);
    });
});

router.get("/users/:id/reviews", middleware.isLoggedIn, middleware.isOwnProfile, function(req, res) {
    User.findById(req.params.id).populate("reviews").exec(function(err, foundUser) {
        if (err) console.log(err);
        res.render("users/reviews", { user: foundUser });
    });
});

router.get("/users/:id/events", middleware.isLoggedIn, function(req, res) {
    User.findById(req.params.id).populate("events").exec(function(err, foundUser) {
        if (err) console.log(err);
        res.render("users/events", { user: foundUser });
    });
});

router.get("/users/:id/offers", middleware.isLoggedIn, function(req, res) {
    User.findById(req.params.id).populate("offers").exec(function(err, foundUser) {
        if (err) console.log(err);
        res.render("users/offers", { user: foundUser });
    });
});

router.get("/users/:id/status/edit", middleware.isLoggedIn, function(req, res) {
    User.findById(req.params.id, function(err, foundUser) {
        res.render("users/descEdit", { user: foundUser });
    });
});

router.get("/users/:id/picture/edit", middleware.isLoggedIn, function(req, res) {
    User.findById(req.params.id, function(err, foundUser) {
        res.render("users/pictureUpdate", { user: foundUser });
    });
});

router.put("/users/:id/status", middleware.isLoggedIn, function(req, res) {
    User.findByIdAndUpdate(req.params.id, { desc: req.body.updateStatus }, function(err, foundUser) {
        if (err) console.log(err);
        foundUser.save();
        res.render("users/ownProfile", { user: foundUser });
    });
});

router.put("/users/:id/picture", middleware.isLoggedIn, function(req, res) {
    User.findByIdAndUpdate(req.params.id, { picture: req.body.picture_url }, function(err, foundUser) {
        if (err) console.log(err);
        foundUser.save();
        res.render("users/ownProfile", { user: foundUser });
    });
});

router.get("/users/:user_id/reviews/:review_id/respond", middleware.isLoggedIn, function(req, res) {
    Review.findById(req.params.review_id, function(err, foundReview) {
        if (err) console.log(err);
        res.render("reviews/respond", { review: foundReview });
    });
});


module.exports = router;
