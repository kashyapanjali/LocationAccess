const { toBeChecked } = require("@testing-library/jest-dom/matchers");
const db = require("../db"); // Database connection
const bcrypt = require("bcrypt"); // For hashing passwords

//sign-up function and exports
exports.signup = (req, res) => {
  const { email, password, username } = req.body;

  //Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: "Error hashing password" });
    }

    //SQL query to insert new user
    const query =
      "INSERT INTO users(email, password, username) VALUES(?, ?, ?)";
    db.query(query, [email, hashedPassword, username], (err, results) => {
      if (err) {
        return res.status(500).json({ error: "Error inserting user" });
      }
      res.json(users);
      res.status(201).json({ message: "User registered successfully" });
    });
  });
};
