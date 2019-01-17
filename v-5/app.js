const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDB = require("./seeds")
    

mongoose.connect("mongodb://localhost:27017/yelp-camp-5", {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"))
seedDB();



app.get("/", function(req, res) {
    res.render("landing");
});

app.get("/campgrounds", function(req, res) {
    Campground.find({}, function(error, campgrounds){
        if (error) {
            console.log(error);
        }
        else {
            res.render("campgrounds/index", {campgrounds:campgrounds});
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
   res.render("campgrounds/new");
});

app.get("/campgrounds/:id", function(req,res) {
    Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampground){
       if (error) {
           console.log(error);
       }
       else {
           res.render("campgrounds/show", {campground: foundCampground});
       }
    });
});

// COMMENTS ROUTE

app.get("/campgrounds/:id/comments/new", function(req, res) {
    Campground.findById(req.params.id, function(error, foundCampground){
        if (error) {
            console.log(error);
        }
        else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

app.post("/campgrounds/:id/comments", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampground) {
        if (error) {
            console.log(error);
        }
        else {
            Comment.create(req.body.comment, function(error, comment){
               if (error) {
                   console.log(error)
               } 
               else {
                   foundCampground.comments.push(comment);
                   foundCampground.save();
                   res.redirect("/campgrounds/" + foundCampground._id)
               }
            });
        }
    });
});




app.listen(process.env.PORT, process.env.IP, function() {
    console.log("The YelpCamp Server has Started!");
});