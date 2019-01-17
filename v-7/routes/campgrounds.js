const express = require("express"),
      router = express.Router(),
      Campground = require('../models/campground');

router.get("/", function(req, res) {
    Campground.find({}, function(error, campgrounds){
        if (error) {
            console.log(error);
        }
        else {
            res.render("campgrounds/index", {campgrounds:campgrounds});
        }
    });
});

router.post("/", isLoggedIn, function(req,res) {
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    const newCampGround = {name: name, image: image, description: description, author: author};
    console.log(req.user);
    Campground.create(newCampGround, function(error, newlyCreated){
        if (error) {
            console.log(error);
        }
        else {
            res.redirect("/campgrounds");
        }
    });
    
});

router.get("/new", isLoggedIn, function(req,res) {
   res.render("campgrounds/new");
});

router.get("/:id", function(req,res) {
    Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampground){
       if (error) {
           console.log(error);
       }
       else {
           res.render("campgrounds/show", {campground: foundCampground});
       }
    });
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;

