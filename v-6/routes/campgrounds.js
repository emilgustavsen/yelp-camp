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

router.post("/", function(req,res) {
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

router.get("/new", function(req,res) {
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

module.exports = router;