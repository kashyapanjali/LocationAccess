import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios"; // Import axios for making API requests
import "./Otp.css"; // Importing the CSS file for styling

function Otp() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const API_URL = "http://localhost:5000/api"; // Backend URL
  const navigate = useNavigate(); // Initialize useNavigate

  // Email validation function
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true); // Start loading state
    try {
      await axios.post(`${API_URL}/send-otp`, { email });
      setMessage("OTP sent to your email!");
    } catch (error) {
      setMessage("Error sending OTP. Please try again.");
      console.error(
        "Send OTP error:",
        error.response ? error.response.data : error.message
      );
    } finally {
      setLoading(false); // End loading state
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/verify-otp`, {
        email,
        otp,
      });
      setMessage(response.data.message); // Assuming the backend sends a success message

      // Save user ID in localStorage
      localStorage.setItem("userId", response.data.userId); // Store the user ID

      // Navigate to LiveLocation dashboard after successful verification
      navigate("/location"); // Redirect to LiveLocation component
    } catch (error) {
      setMessage("Error verifying OTP. Please try again.");
      console.error(
        "Verify OTP error:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="auth">
      <img
        className="login_logo"
        src="https://png.pngtree.com/png-vector/20230413/ourmid/pngtree-3d-location-icon-clipart-in-transparent-background-vector-png-image_6704161.png"
        alt="Location icon"
      />
      <div className="login_container">
        <h1>OTP Authentication</h1>
        <form className="form" onSubmit={handleSendOtp}>
          <h5>Email</h5>
          <input
            type="email"
            placeholder="Enter your email"
            className="email_input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="otp_generate" disabled={loading}>
            {loading ? "Sending..." : "Request OTP"}
          </button>
        </form>
        <form className="form" onSubmit={handleVerifyOtp}>
          <h5>OTP</h5>
          <input
            type="text"
            placeholder="Enter OTP"
            className="otp_input"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
          <button className="verify_button">Verify OTP</button>
        </form>
        {message && <p className="message">{message}</p>}{" "}
        {/* Display messages */}
        <Link className="home" to="/">
          SignInUp?
        </Link>
      </div>
    </div>
  );
}

export default Otp;
