var mongoose = require("mongoose");

var taskSchema = mongoose.Schema({
    title: String,
    text: String,
    role: String,
    event: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event"
        }
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Task", taskSchema);
