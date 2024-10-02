import { Link } from "react-router-dom";
import { useState } from "react";
import React from "react";
import axios from "axios"; // Import axios for making HTTP requests
import "./Otp.css"; // Importing the CSS file for styling

function Otp() {
  //States for email, OTP, and messages
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false); // to track if otp is sent

  //Backend API URL
  const API_URL = "http://localhost:5000/api/auth"; //adjust as needed

  //function to handle otp request
  const handleOtpRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/send-otp`, { email });
      setMessage("OTP sent to your email. Please check your inbox");
      setOtpSent(true); //Update state to show OTP input
    } catch (error) {
      console.error("OTP request error:", error.response); // Log the entire response
      setMessage(
        error.response
          ? error.response.data.message
          : "Failed to send OTP. Please try again"
      );
    }
  };
  const handleOtpVerification = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/verify-otp`, {
        email,
        otp,
      });
      setMessage("OTP verified successfully. You are logged in.");
    } catch (error) {
      setMessage("Invalid OTP. Please try again");
      console.log("OTP verification error:", error);
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
        {message && <p className="message">{message}</p>} {/* Show message */}
        <form className="form">
          <h5>Email</h5>
          <input
            type="email"
            placeholder="Enter your email"
            className="email_input"
            value={email}
            onChange={(e) => setEmail(e.target.value)} //update email State
            required
          />
          {!otpSent ? (
            <button className="otp_generate" onClick={handleOtpRequest}>
              Request OTP
            </button>
          ) : (
            <>
              <h5>OTP</h5>
              <input
                type="text"
                placeholder="Enter OTP"
                className="otp_input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)} // Update OTP state
                required
              />
              <button className="verify_button" onClick={handleOtpVerification}>
                Verify OTP
              </button>
            </>
          )}
        </form>
        <Link className="home" to="/home">
          home?
        </Link>
      </div>
    </div>
  );
}

export default Otp;
