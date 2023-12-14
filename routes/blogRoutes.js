const express = require("express");
const router = express.Router();
const db = require("../database");
const multer = require("multer");

// sql query to get all blog posts from the database and display them on the page ordered by creation time/date with category options
router.get("/", (req, res) => {
  const { category } = req.query;
  let query = "SELECT * FROM posts ORDER BY created_at DESC";

  if (category) {
    query = `SELECT * FROM posts WHERE category = ? ORDER BY created_at DESC`;
  }

  let categories; // Declare categories variable outside the scope first

  // Fetch categories
  db.all(
    "SELECT DISTINCT category FROM posts",
    [],
    (err, fetchedCategories) => {
      if (err) {
        console.error("Error fetching categories:", err.message);
        categories = []; // Assign an empty array in case of an error
      } else {
        categories = fetchedCategories; // Assign fetchedCategories to the categories variable

        // Fetch posts after fetching categories
        db.all(query, category ? [category] : [], (err, posts) => {
          if (err) {
            console.error("Error fetching posts:", err.message);
            posts = []; // Assign an empty array in case of an error
          }

          res.render("index", { posts, categories });
        });
      }
    }
  );
});

// route to display the form for a new blogpost
router.get("/new", (req, res) => {
  res.render("new");
});

// route to delete a blog post from the database and redirect to the blog listing page
router.delete("/:id", (req, res) => {
  const postId = req.params.id;

  // runs the sql query to delete the post from the database
  db.run("DELETE FROM posts WHERE id = ?", [postId], (err) => {
    if (err) {
      console.error(err.message);
      res.sendStatus(500); // Internal Server Error
      return;
    }

    res.redirect("/blogs"); // Redirect to the blog listing page
  });
});

// multer middleware to upload the image file
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// route to add blog post to the database and redirect to the blog listing page
// uses the POST method to send the data to the server
router.post("/", upload.single("image"), (req, res) => {
  const { title, content, category } = req.body;
  const image = req.file;

  const imageBase64 = image ? image.buffer.toString("base64") : null;
  db.run(
    "INSERT INTO posts (title, content, category, image_url) VALUES (?, ?, ?, ?)",
    [title, content, category, imageBase64],
    (err) => {
      if (err) {
        throw err;
      }
      res.redirect("/blogs");
    }
  );
});

module.exports = router;
