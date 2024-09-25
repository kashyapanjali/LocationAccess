const db = require("../db"); //databse connection
const bcrypt = require("bcrypt"); // for comparing passwords

//login functions and exports
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    //check if user exists in the database
    const query = "SELECT * FROM users WHERE email = ?";
    const [rows] = await db.query(query, [email]);

    if (rows.length === 0) {
      //if user does not exist

      return res.status(400).json({ error: "User not found" });
    }
    const user = rows[0]; // Extract the first row(user)

    //Compare the entered password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    //If credentials are correct

    res.status(200).json({
      message: "Login successful",
      user: { username: user.username, email: user.email },
    });
  } catch (err) {
    console.error("Login error:", err); //Log the actual error

    res.status(500).json({ error: "Error during login" });
  }
};
