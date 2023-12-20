function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
// Use this middleware in routes you want to protect
app.get("/protected-route", checkAuthenticated, (req, res) => {
  // Protected route logic
});
