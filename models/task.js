var mongoose = require("mongoose");

var taskSchema = mongoose.Schema({
    title: String,
    text: String,
    type: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Task", taskSchema);