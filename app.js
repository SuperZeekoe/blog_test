// Imports various modules and sets up the app
const express = require("express"); // imports express
const methodOverride = require("method-override"); // allows us to use PUT and DELETE methods
const path = require("path"); // ensures that the path is correct
const app = express(); // initializes the app

const blogRoutes = require("./routes/blogRoutes"); // ensure this path is correct?
const db = require("./database"); // ensures that the database is connected

// setting up the app
app.use(express.static(path.join(__dirname + "/public"))); // ensures that the public folder is accessible to the app through require("path")
app.set("view engine", "ejs"); // makes sure the app uses the view engine and sets it to ejs
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); // allows the use of PUT and DELETE methods

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
