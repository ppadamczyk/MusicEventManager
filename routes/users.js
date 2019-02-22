var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware/index");

router.get("/users", middleware.isLoggedIn, function(req, res) {
    User.find({}),function(err, foundUser){
        if(err){
            console.log(err);
        }
        res.render("users/index", {users:foundUser});
    };
});



module.exports = router;