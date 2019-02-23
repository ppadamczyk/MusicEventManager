var mongoose = require("mongoose");

var reviewSchema = mongoose.Schema({
    title: String,
    text: String,
    grade: Number,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Review", reviewSchema);