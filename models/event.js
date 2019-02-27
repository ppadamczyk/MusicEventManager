var mongoose = require("mongoose");
var deepPopulate = require('mongoose-deep-populate')(mongoose);

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
    },
    contractors:{
        artists: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
            },
        ],
        techs: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
            },
        ],
        gear_owners: [
            {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
            },
        ],
        place_owner:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
            },
    }
    
});


EventSchema.plugin(deepPopulate);
module.exports = mongoose.model("Event", EventSchema);