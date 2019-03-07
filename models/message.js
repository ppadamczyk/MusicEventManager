var mongoose = require("mongoose");

var messageSchema = mongoose.Schema({
    topic: String,
    text: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Message", messageSchema);
