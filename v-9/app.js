const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    flash = require("connect-flash"),
    methodOverride = require("method-override"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require("./models/user"),
    seedDB = require("./seeds");
    
    
const commentRoutes = require("./routes/comments"),
    camgroundRoutes = require("./routes/campgrounds"),
    authRoutes = require("./routes/index");
    

mongoose.connect("mongodb://localhost:27017/yelp-camp-10", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
app.use(methodOverride("_method"))
app.use(flash());
// seedDB(); Seed database

app.use(require("express-session")({
    secret: "Don't tell anyone but I have 2 bellybuttons",
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
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/campgrounds", camgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", authRoutes);


app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp Server has Started!");
});