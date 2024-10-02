import { Link } from "react-router-dom";
import React from "react";
import "./Otp.css"; // Importing the CSS file for styling

function Otp() {
  return (
    <div className="auth">
      <img
        className="login_logo"
        src="https://png.pngtree.com/png-vector/20230413/ourmid/pngtree-3d-location-icon-clipart-in-transparent-background-vector-png-image_6704161.png"
        alt="Location icon"
      />
      <div className="login_container">
        <h1>OTP Authentication</h1>
        <form className="form">
          <h5>Email</h5>
          <input
            type="email"
            placeholder="Enter your email"
            className="email_input"
          />
          <button className="otp_generate">Request OTP</button>

          <h5>OTP</h5>
          <input type="text" placeholder="Enter OTP" className="otp_input" />

          <button className="verify_button">Verify OTP</button>
        </form>
        <Link className="home" to="/">
          home?
        </Link>
      </div>
    </div>
  );
}

export default Otp;
