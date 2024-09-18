// const { toBeChecked } = require("@testing-library/jest-dom/matchers");
const db = require("../db"); // Database connection
const bcrypt = require("bcrypt"); // For hashing passwords

//sign-up function and exports
exports.signup = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    //Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    //SQL query to insert new user
    const query =
      "INSERT INTO users(email, password, username) VALUES(?, ?, ?)";
    await db.query(query, [email, hashedPassword, username]);

    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Database insertion error:", err); // Log the actual error
    res.status(500).json({ error: "Error inserting user" });
  }
};
