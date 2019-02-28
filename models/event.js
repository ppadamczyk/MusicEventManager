var mongoose = require("mongoose");
var deepPopulate = require('mongoose-deep-populate')(mongoose);

var EventSchema = new mongoose.Schema({
    event_name : String,
    description: String,
    picture: String,
    isFinished: Boolean,
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
    },
    tasks:{
        artists:[
            {
            title:String,
            text:String,
            priority:Boolean
            }
        ],
        techs:[
            {
            title:String,
            text:String,
            priority:Boolean
            }
        ],
        gear_owners:[
            {
            title:String,
            text:String,
            priority:Boolean
            }
        ],
        place_owner:[
            {
            title:String,
            text:String,
            priority:Boolean
            }
        ]
    }
    
});


EventSchema.plugin(deepPopulate);
module.exports = mongoose.model("Event", EventSchema);