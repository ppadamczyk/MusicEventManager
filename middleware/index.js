var User = require("../models/user");
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
};

middlewareObj.ownProfile = function(req, res, next) {
    if (req.user._id.equals(req.params.id)) {
        User.findById(req.params.id).populate("reviews").exec(function(err, foundUser) {
            if (err) {}
            res.render("users/ownProfile", { user: foundUser });
        });
    }
    else next();
};

middlewareObj.isOwnProfile = function(req, res, next) {
    if (req.user._id.equals(req.params.id)) {
        next();
    }
    else {
        res.render("main");
    }
};


module.exports = middlewareObj;
