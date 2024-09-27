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

  // Automatically delete OTP after 5 minutes (300,000 ms)
  setTimeout(() => {
    if (otps.has(email)) {
      otps.delete(email);
      console.log(`OTP for ${email} has expired and been removed.`);
    }
  }, 300000); // 5 minutes for actual implementation

  // Setup nodemailer to send email
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // Use port 587 for TLS
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
    tls: {
      rejectUnauthorized: false, // Use true in production with valid certs
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
    // OTP verified successfully, now delete the OTP from the map
    otps.delete(email);
    res.status(200).json({ message: "OTP verified successfully" });
  } else {
    res.status(400).json({ message: "Invalid OTP" });
  }
};
