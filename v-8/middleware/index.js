const middlewareObj = {};
const Campground = require('../models/campground');
const Comment = require('../models/comment');



middlewareObj.isLoggedIn = function(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Sign In First!");
    res.redirect("/login");
};

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, function(error, foundComment){
            if (error) {
                res.redirect("back");
                console.log(error);
            }
            else {
                if (foundComment.author.id.equals(req.user._id)) {
                next();
                }
                else {
                    res.redirect("back");
                }
            }
    });
    } else {
        res.redirect("back");
    }
};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(error, foundCampground){
            if (error) {
                res.redirect("back");
                console.log(error);
            }
            else {
                if (foundCampground.author.id.equals(req.user._id)) {
                next();
                }
                else {
                    res.redirect("back");
                }
            }
    });
    } else {
        res.redirect("back");
    }
};

module.exports = middlewareObj;