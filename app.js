// Imports various modules and sets up the app
const express = require("express"); // imports express
const methodOverride = require("method-override"); // allows us to use PUT and DELETE methods
const path = require("path"); // ensures that the path is correct
const app = express(); // initializes the app
const session = require("express-session"); // allows the use of sessions
const passport = require("passport"); // allows the use of passport
const flash = require("connect-flash"); // allows the use of flash messages

const blogRoutes = require("./routes/blogRoutes"); // ensure this path is correct?
const db = require("./database"); // ensures that the database is connected

// setting up the app
app.use(express.static(path.join(__dirname + "/public"))); // ensures that the public folder is accessible to the app through require("path")
app.set("view engine", "ejs"); // makes sure the app uses the view engine and sets it to ejs
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); // allows the use of PUT and DELETE methods

// express session setup
app.use(session({
  secret: "secret",
  resave: false,
  saveUninitialized: false
}));

// passport setup
app.use(passport.initialize());
app.use(passport.session());

// connect flash setup
app.use(flash());

// global variables for flash messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg"); // sets the success message
  res.locals.error_msg = req.flash("error_msg"); // sets the error message
  res.locals.error = req.flash("error"); // sets the error message
  next();
});


// routes
app.get("/", (req, res) => res.redirect("/blogs")); // redirects the root to the blogs page
app.use("/blogs", blogRoutes); // ensures that all routes in blogRoutes are prefixed with /blogs

// setting the database
const PORT = process.env.PORT || 3000; // makes sure the app is running on port:3000
app.listen(PORT, () => {
  console.log(`Service is now operational on port ${PORT}`); // logs the port the app is running on
});
// Log errors related to static file serving
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!"); // error message on console in case something goes wrong
});
