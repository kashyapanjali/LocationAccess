const nodemailer = require("nodemailer");
require("dotenv").config();

// Store OTPs temporarily in memory
const otps = new Map();

// Send OTP controller
exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

  // Save OTP in memory for later verification
  otps.set(email, otp);

  // Setup nodemailer to send email
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP code is ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending OTP", error });
  }
};

// Verify OTP controller
exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  const storedOtp = otps.get(email);

  if (storedOtp && storedOtp == otp) {
    res.status(200).json({ message: "OTP verified successfully" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
};
