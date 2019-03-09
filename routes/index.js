var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware/index");

router.get("/", function(req, res) {
    res.render("index");
});

router.get("/noFrontendAlert", function(req, res) {
    res.render("noFrontendAlert");
});

router.get("/main", middleware.isLoggedIn, function(req, res) {
    res.render("main");
});

router.get("/register", function(req, res) {
    res.render("register");
});

router.post("/register", function(req, res) {
    var newUser = new User({ username: req.body.username, roles: req.body.roles, desc: "", picture: "https://forums.roku.com/styles/canvas/theme/images/no_avatar.jpg" });
    User.register(newUser, req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/main");
        });
    });
});

router.get("/login", function(req, res) {
    res.render("login");
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/main",
    failureRedirect: "/login"
}), function(req, res) {});

router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/main");
});

router.get("/about", function(req, res) {
    res.render("about");
});

module.exports = router;
