var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get("/marketplace", function(req, res){
   res.render("marketplace/index"); 
});

router.get("/marketplace/new", function(req, res){
    res.render("marketplace/new");
});

module.exports = router;