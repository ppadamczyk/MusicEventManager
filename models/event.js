var mongoose = require("mongoose");

var EventSchema = new mongoose.Schema({
    event_name : String,
    description: String,
    picture: String,
    author:{
         id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
    }
    
});

module.exports = mongoose.model("Event", EventSchema);