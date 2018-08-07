const   Campground      = require("../models/campground"),
        Comment         = require("../models/comment"),
        User            = require("../models/user"),
        middlewareObj   = {};

middlewareObj.isUserCampgroundOwner = function(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, foundCampground) {
            if (err) {
                req.flash("error", "Campground not found");
                console.log(err);
                res.redirect("back");
            } else {
                if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
                    return next();
                } else {
                    req.flash("error", "Permission denied");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in");
        res.redirect("back");
    }
};

middlewareObj.isUserCommentOwner = function(req, res, next) {
    if (req.isAuthenticated()) {    
        Comment.findById(req.params.comment_id, function(err, foundComment) {
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                    return next();
                } else {
                    req.flash("error", "Permission denied");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in");
        res.redirect("/login");
    }
};

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "You need to be logged in");
    res.redirect("/login");
};

middlewareObj.isUserAuthorized = function(req, res, next) {
    if (req.isAuthenticated()) {
        User.findById(req.params.id, function(err, foundUser) {
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                if (foundUser._id.equals(req.user._id)) {
                    return next();
                } else {
                    req.flash("error", "Permission denied");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in");
        res.redirect("back");
    }
};

module.exports = middlewareObj;