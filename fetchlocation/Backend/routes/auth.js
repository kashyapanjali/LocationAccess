const express = require("express");
const router = express.Router();
const { signup, test } = require("../controllers/signup"); //Signup controller
const { login } = require("../controllers/login"); // Login controller

//SignUp route
router.post("/signup", signup);
router.get("/signup", test);

//login route
router.post("/login", login);
router.get("/login", login);

module.exports = router;
