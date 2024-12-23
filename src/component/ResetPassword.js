import React, { useState } from "react";
import { useNavigate, useLocation, Link, useParams } from "react-router-dom";
import "./ForgetPassword.css"; // Reuse the same CSS file for consistent styling
import axios from "axios";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const { id, token } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Backend URL (replace with your actual server URL)
  const API_URL = "http://localhost:5000/api";

  // Extract reset token from query parameters
  const resetToken = new URLSearchParams(location.search).get("token");

  // Handle setting a new password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    try {
      await axios.post(`${API_URL}/reset-password/${id}/${token}`, {
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
        <h1>Reset Password</h1>

        {/* Display message */}
        {message && <p className="successMessage">{message}</p>}

        <form className="form" onSubmit={handleResetPassword}>
          <h5>New Password</h5>
          <input
            type="password"
            placeholder="Enter your new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <h5>Confirm New Password</h5>
          <input
            type="password"
            placeholder="Confirm your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="login_signInButton">
            Reset Password
          </button>
        </form>

        <p className="backToLogin">
          <Link to="/">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}
