const bodyParser = require("body-parser");
const express = require("express");
const flash = require("connect-flash");
const LocalStrategy = require("passport-local");
const methodOverride = require("method-override");
const morgan = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");

// database === === ===
// change the database name, and uncomment
// mongoose.connect("mongodb://localhost/express_starter");

// models
const User = require("./models/user");

// express server
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require("moment");

// passport auth
app.use(
  require("express-session")({
    secret: "I love to eat burgers, but they are not good for me.",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// routes and routers
const indexRoutes = require("./routes/index");

app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

app.use("/", indexRoutes);

// start the server
const PORT = 5000;
app.listen(process.env.PORT || PORT, process.env.IP, () => {
  console.log("Express Server has Started!");
});
