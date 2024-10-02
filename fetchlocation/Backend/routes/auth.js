const express = require("express");
const router = express.Router();
const { signup, test } = require("../controllers/signup"); //Signup controller
const { login } = require("../controllers/login"); // Login controller
const { sendOtp, verifyOtp } = require("../controllers/otpController");

//SignUp route
router.post("/signup", signup);

//login route
router.post("/login", login);

// Routes for sending and verifying OTP
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

module.exports = router;
