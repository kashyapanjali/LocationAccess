import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./ForgetPassword.css";
import axios from "axios";

export default function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Backend URL (replace with your actual server URL)
  const API_URL = "http://localhost:5000/api";

  // Extract reset token from query parameters
  const resetToken = new URLSearchParams(location.search).get("token");

  // Email validation function
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Handle password reset request
  const handleForgetPassword = async (e) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      await axios.post(`${API_URL}/forget-password`, { email });
      setMessage("Password reset email sent! Check your inbox.");
    } catch (error) {
      setMessage("Error sending password reset email. Please try again.");
      console.error("Forget password error:", error);
    }
  };

  // Handle setting a new password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      await axios.post(`${API_URL}/reset-password`, {
        resetToken,
        password,
      });
      setMessage("Password has been successfully reset!");
      navigate("/"); // Redirect to login page after successful reset
    } catch (error) {
      setMessage("Error resetting password. Please try again.");
      console.error("Reset password error:", error);
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
        <h1>{resetToken ? "Set New Password" : "Forgot Password"}</h1>

        {/* Display message */}
        {message && <p className="successMessage">{message}</p>}

        {!resetToken ? (
          <form className="form" onSubmit={handleForgetPassword}>
            <h5>E-mail</h5>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="login_signInButton">
              Send Reset Link
            </button>
          </form>
        ) : (
          <form className="form" onSubmit={handleResetPassword}>
            <h5>New Password</h5>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <h5>Confirm New Password</h5>
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button type="submit" className="login_signInButton">
              Reset Password
            </button>
          </form>
        )}

        {!resetToken && (
          <p className="backToLogin">
            <Link to="/">Back to Login</Link>
          </p>
        )}
      </div>
    </div>
  );
}
