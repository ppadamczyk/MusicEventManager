var express = require("express"),
    app = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    flash        = require("connect-flash"),
    session = require("express-session"),
    methodOverride = require("method-override");


//req routes
var indexRoutes = require("./routes/index");


//mongoose.connect("mongodb://localhost/music_event_manager");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));

app.use("/", indexRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is up!");
});