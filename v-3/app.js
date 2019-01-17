const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds")
    
    

seedDB();
/* let campgrounds = [
            {name: "Salmon Creek", image: "https://farm8.staticflickr.com/7351/9756241141_0854983f93.jpg"},
            {name: "Granite Hill", image: "https://farm6.staticflickr.com/5222/5611578349_c47eae741a.jpg"},
            {name: "Mountain Goat's Rest", image: "https://farm6.staticflickr.com/5222/5611578349_c47eae741a.jpg"}
]; */

mongoose.connect("mongodb://localhost:27017/yelp-camp-3", {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");



app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {
    Campground.find({}, function(error, campgrounds){
        if (error) {
            console.log(error);
        }
        else {
            res.render("index", {campgrounds:campgrounds});
        }
    });
});

app.post("/campgrounds", function(req,res) {
    // Get data from form and add to campgrounds array
    // Reroute back to /campgrounds
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description
    const newCampGround = {name: name, image: image, description: description};
    Campground.create(newCampGround, function(error, newlyCreated){
        if (error) {
            console.log(error);
        }
        else {
            res.redirect("/campgrounds");
        }
    });
    
});

app.get("/campgrounds/new", function(req,res) {
   res.render("new");
});

app.get("/campgrounds/:id", function(req,res) {
    Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampground){
       if (error) {
           console.log(error)
       }
       else {
           res.render("show", {campground: foundCampground})
       }
    });
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp Server has Started!");
});