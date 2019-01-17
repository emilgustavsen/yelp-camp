const express = require("express"),
      router = express.Router({mergeParams: true}),
      Campground = require('../models/campground'),
      Comment = require('../models/comment')

router.get("/new", isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(error, foundCampground){
        if (error) {
            console.log(error);
        }
        else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

router.post("/", isLoggedIn, function(req, res) {
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
                   comment.author.id = req.user._id;
                   comment.author.username = req.user.username;
                   comment.save();
                   foundCampground.comments.push(comment);
                   foundCampground.save();
                   console.log(comment);
                   res.redirect("/campgrounds/" + foundCampground._id)
               }
            });
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