var mongoose = require("mongoose");
var deepPopulate = require('mongoose-deep-populate')(mongoose);
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    picture: String,
    desc: String,
    roles: {
        organizer: Boolean,
        artist: Boolean,
        tech: Boolean,
        place_owner: Boolean,
        gear_owner: Boolean
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }, ],
    events: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event"
    }, ],
    contracts: [{
        contract_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event"
        },
        role: String,
        isConfirmed: Boolean
    }, ],
    offers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Offer"
    }, ],
    inbox: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    }]
});
UserSchema.plugin(deepPopulate);
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
