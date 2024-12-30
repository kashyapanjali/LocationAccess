import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./Auth.css";
import axios from "axios";

export default function Auth() {
  const [username, setUserName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Backend URL (replace with your actual server URL)
  const API_URL = "http://localhost:5000/api";

  // Email validation function
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Password validation function
  const isValidPassword = (password) => {
    // Check if password has at least 6 characters, one lowercase letter, one uppercase letter, one digit, and one special character
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    return regex.test(password);
  };

  // For submit when user signs in and up as well
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate email before proceeding
    if (!isValidEmail(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

    // Validate password
    if (!isValidPassword(password)) {
      setMessage(
        "Password must be at least 6 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character."
      );
      return;
    }

    if (isSignUp) {
      // Sign up user here
      try {
        const response = await axios.post(`${API_URL}/register`, {
          username,
          email,
          password,
        });

        console.log("Sign-up response:", response.data);
        setMessage("Sign-up successful! You can now sign in.");
        setIsSignUp(false);
      } catch (error) {
        setMessage("Error signing up. Please try again.");
        console.error(
          "Sign-up error:",
          error.response ? error.response.data : error.message
        );
      }
    } else {
      // Sign in user
      try {
        const response = await axios.post(`${API_URL}/login`, {
          email,
          password,
        });
        console.log("Sign-in response:", response.data);
        setMessage("Sign-in successful! Welcome back.");

        // Save actual userId in localStorage to use it when sending location updates
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("username", response.data.username);
        console.log("Username stored in localStorage:", response.data.username);

        // Redirect to location page after successful login
        navigate("/location");
      } catch (error) {
        setMessage("Invalid email or password. Please try again.");
        console.error("Sign-in error:", error);
      }
    }
  };

  const toggleForm = () => {
    setMessage("");
    setIsSignUp((prev) => !prev);
  };

  return (
    <div className="auth">
      <img
        className="login_logo"
        src="https://png.pngtree.com/png-vector/20230413/ourmid/pngtree-3d-location-icon-clipart-in-transparent-background-vector-png-image_6704161.png"
        alt="Location icon"
      />

      <div className="login_container">
        <h1>{isSignUp ? " Sign Up" : "Sign In"}</h1>

        {/* Show success message after sign-up */}
        {message && <p className="successMessage">{message}</p>}

        <form className="form" onSubmit={handleSubmit}>
          {isSignUp && (
            <>
              <h5>Username</h5>
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </>
          )}

          <h5>E-mail</h5>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Update email
            required
          />

          <h5>Password</h5>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="login_signInButton">
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
          <p className="forgetPass">
            <Link className="linkpass" to="/forget-password">
              Forget Password
            </Link>
          </p>
        </form>
        <Link className="otpMain" to="/otp">
          OTP Generate
        </Link>
        <p className="des">
          By {isSignUp ? "signing up" : "signing in"}, you agree to our Terms
          and Conditions for accessing location data.
        </p>
        <button type="button" className="toggleButton" onClick={toggleForm}>
          {isSignUp
            ? "Already have an account? Sign In"
            : "New here? Create an account"}
        </button>
      </div>
    </div>
  );
}
