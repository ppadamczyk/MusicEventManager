var express = require("express");
var router = express.Router();
var Task = require("../models/task");
var Event = require("../models/event");
var middleware = require("../middleware/index");
var User = require("../models/user");

router.get("/users/:user_id/tasks", middleware.isLoggedIn, function(req, res) {
    User.findById(req.params.user_id).deepPopulate("contracts.contract_id contracts.contract_id.tasks contract.contract_id.event_name contract.contract_id.event_date contract.contract_id.description contract.contract_id.picture").exec(function(err, foundUser) {
        if (err) console.log(err);
        res.render("events/tasks/index", { user: foundUser });
    });
});

router.delete("/events/:eventid/tasks/:id", middleware.isLoggedIn, function(req, res) {
    Task.findOneAndDelete(req.params.id, function(err) {
        if (err) console.log(err);
        Event.findById(req.params.eventid, function(err, foundEvent) {
            if (err) console.log(err);
            let position = foundEvent.tasks.findIndex(function(task) { return task._id === req.params.id });
            foundEvent.tasks.splice(position, 1);
            foundEvent.save();
        });
        res.redirect('back');
    });
});

router.get("/events/:eventid/tasks/:id", middleware.isLoggedIn, function(req, res) {
    Task.findById(req.params.id, function(err, foundTask) {
        if (err) console.log(err);
        res.render("events/tasks/edit", { task: foundTask });
    });
});

router.put("/events/:eventid/tasks/:id", middleware.isLoggedIn, function(req, res) {
    Task.findOneAndUpdate(req.params.id, req.body.newly, function(err, updatedTask) {
        if (err) console.log(err);
        console.log(updatedTask);
        res.redirect("/main");
    });
});

module.exports = router;
