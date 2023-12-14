// initialize database with SQlite

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./blog.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the existing SQLITE database. ");
});
// create the posts table if it doesn't exist
// added options include category and image_url
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT, 
    image_url TEXT, --
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
});
// export the database connection
module.exports = db;
