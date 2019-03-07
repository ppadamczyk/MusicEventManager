var mongoose = require("mongoose");

var reportSchema = mongoose.Schema({
    title: String,
    text: String,
    target: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Report", reportSchema);
