const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
// database setup
const db = require("./database");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await findUserByUsername(username);
      if (!user) {
        return done(null, false, {
          message: "That username is not registered",
        });
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Password incorrect" });
        }
      });
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
      done(err, row);
    });
  });
};

async function findUserByUsername(username) {
  return new Promise((Resolve, reject) => {
    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
      if (err) {
        reject(err);
      }
      Resolve(row);
    });
  });
}
