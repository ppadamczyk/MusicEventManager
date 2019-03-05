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
    
    contractors:[{
        contractor_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        role: String,
        isConfirmed: Boolean
    }],

    tasks:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Task"
        },
    ]
});


EventSchema.plugin(deepPopulate);
module.exports = mongoose.model("Event", EventSchema);