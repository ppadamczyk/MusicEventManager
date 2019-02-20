var mongoose = require("mongoose");

var OfferSchema = new mongoose.Schema({
    offer_name : String,
    description: String,
    price: String,
    type: String,
    picture: String,
    author:{
         id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String
    }
    
});

module.exports = mongoose.model("Offer", OfferSchema);