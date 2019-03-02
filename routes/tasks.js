var express = require("express");
var router  = express.Router();
var Task = require("../models/task");
var Event = require("../models/event");
var middleware = require("../middleware/index");

router.delete("/events/:eventid/tasks/:id", middleware.isLoggedIn, function(req, res){
    var whichType = req.params.type;
    Task.findOneAndDelete(req.params.id, function(err){
        if(err){
            console.log(err);
        }
        Event.findById(req.params.eventid, function(err, foundEvent){
           if(err)console.log(err);
            let position = foundEvent.tasks.findIndex(function(task){return task._id===req.params.id});
            foundEvent.tasks.splice(position, 1);
            foundEvent.save();
           
        });
        res.redirect("/events/"+req.params.eventid+"/manage");
    });
});

module.exports = router;