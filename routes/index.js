const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");

router.get("/", (req, res) => {
  res.send("root!");
  // res.render("landing");
});

// show the register form
router.get("/register", (req, res) => {
  res.send("register!");
  // res.render("register", { page: "register" });
});

// show the login form
router.get("/login", (req, res) => {
  res.send("login!");
  // res.render("login", { page: "login" });
});

// show the logout form
router.get("/logout", (req, res) => {
  res.send("logout!");
  // req.logout();
  // req.flash("success", "You have been logged out.");
  // res.redirect("/");
});

// create a new user, add them to the database, and authenticate them
router.post("/register", (req, res) => {
  const user = new User({
    username: req.body.username
  });
  User.register(user, req.body.password, (err, newUser) => {
    if (err) {
      req.flash("error", err.message);
      console.log(err);
      return res.redirect("register");
    }
    passport.authenticate("local")(req, res, () => {
      req.flash("success",`You have successfully signed up, ${newUser.username}!`);
      res.redirect("/");
    });
  });
});

// log a user in
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login"
  }),
  (req, res) => {}
);

router.get("/users/:user_id", (req, res) => {
  User.findById(req.params.user_id, (err, user) => {
    if (err) {
      req.flash("error", "A database error has occurred.");
      res.redirect("back");
    } else if (!user) {
      req.flash("error", "That user no longer exists.");
      res.redirect("back");
    } else {
      res.render("users/show", { user });
    }
  });
});

module.exports = router;
