var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    roles: {
        organizer: Boolean,
        artist: Boolean,
        tech: Boolean,
        place_owner: Boolean,
        gear_owner: Boolean
    }
});

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);