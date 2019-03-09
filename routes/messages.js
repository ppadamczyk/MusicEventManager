var express = require("express");
var router = express.Router();
var User = require("../models/user");
var Message = require("../models/message");
var middleware = require("../middleware/index");

router.get("/users/:id/inbox", middleware.isLoggedIn, function(req, res) {
    User.findById(req.params.id).populate("inbox").exec(function(err, foundUser) {
        if (err) console.log(err);
        res.render("inbox", { user: foundUser });
    });
});

router.get("/users/:id/message/new", middleware.isLoggedIn, function(req, res) {
    User.findById(req.params.id, function(err, foundUser) {
        if (err) console.log(err);
        res.render("messages/new", { user: foundUser });
    });
});

router.post("/users/:id/message", middleware.isLoggedIn, function(req, res) {
    let newMessage = req.body.message;
    newMessage.author = {
        id: req.user._id,
        username: req.user.username
    };
    Message.create(newMessage, function(err, newlyCreated) {
        newlyCreated.save();
        User.findById(req.params.id, function(err, foundUser) {
            foundUser.inbox.push(newlyCreated._id);
            foundUser.save();
            res.render("main");
        });
    });
});

router.delete("/:user_id/messages/:msg_id", middleware.isLoggedIn, function(req, res) {
    Message.findById(req.params.msg_id, function(err, foundMessage) {
        User.findById(req.params.user_id, function(err, foundUser) {
            let toBeDeleted = foundUser.inbox.indexOf(foundMessage);
            foundUser.inbox.splice(toBeDeleted, 1);
            foundUser.save();
            foundMessage.remove(err);
            foundMessage.save();
            res.redirect("/main");
        });
    });
});

router.get("/messages/:msg_id/answer/:usr_id", middleware.isLoggedIn, function(req, res) {
    User.findById(req.params.usr_id, function(err, foundUser) {
        res.render("messages/new", { user: foundUser });
    });
});

module.exports = router;
