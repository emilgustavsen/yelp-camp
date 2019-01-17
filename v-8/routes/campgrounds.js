const express = require("express"),
      router = express.Router(),
      Campground = require('../models/campground'),
      middleware = require("../middleware");

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

router.post("/", middleware.isLoggedIn, function(req,res) {
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

router.get("/new", middleware.isLoggedIn, function(req,res) {
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

//Edit campground routes:

router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
        Campground.findById(req.params.id, function(error, foundCampground){
                res.render("campgrounds/edit", {campground: foundCampground});
        });
});

router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findOneAndUpdate(req.params.id, req.body.campground, function(error, updatedCampground) {
       if (error) {
           console.log(error);
           res.redirect("/campgrounds");
       } 
       else {
           res.redirect("/campgrounds/" + updatedCampground._id);
       }
    });
    
});

// Destroy campground route
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(error){
        if (error) {
            console.log(error);
            res.redirect("/campgrounds");
        }
        else {
            res.redirect("/campgrounds");
        }
    })
});


module.exports = router;

