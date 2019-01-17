const middlewareObj = {};
const Campground = require('../models/campground');
const Comment = require('../models/comment');



middlewareObj.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "ERROR - You need to be signed in to do that.");
    res.redirect("/login");
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(error, foundComment){
            if (error) {
                req.flash("error", "ERROR - Comment not found")
                res.redirect("back");
                console.log(error);
            }
            else {
                if (foundComment.author.id.equals(req.user._id)) {
                next();
                }
                else {
                    req.flash("error", "ERROR - You don't have permission to do that.");
                    res.redirect("back");
                }
            }
    });
    } else {
        req.flash("error", "ERROR - You need to be signed in to do that.");
        res.redirect("back");
    }
};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(error, foundCampground){
            if (error) {
                req.flash("error", "ERROR - Campground not found")
                res.redirect("back");
                console.log(error);
            }
            else {
                if (foundCampground.author.id.equals(req.user._id)) {
                next();
                }
                else {
                    req.flash("error", "You don't have permission to do that.");
                    res.redirect("back");
                }
            }
    });
    } else {
        req.flash("error", "You need to be signed in to do that.");
        res.redirect("back");
    }
};

module.exports = middlewareObj;