var express = require("express"),
    app = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    User        = require("./models/user"),
    Offer       = require("./models/offer"),
    Task       = require("./models/task"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    flash        = require("connect-flash"),
    session = require("express-session"),
    methodOverride = require("method-override");



app.use(require("express-session")({
    secret: "I love my university",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});



//req routes
var indexRoutes = require("./routes/index");
var marketplaceRoutes = require("./routes/marketplace");
var eventRoutes = require("./routes/events");
var userRoutes = require("./routes/users");
var taskRoutes = require("./routes/tasks");


mongoose.connect("mongodb://localhost/music_event_manager", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));

app.use("/", indexRoutes);
app.use("/", marketplaceRoutes);
app.use("/", eventRoutes);
app.use("/", userRoutes);
app.use("/", taskRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server is up!");
});