import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgetPassword.css";
import axios from "axios";
import config from "../config";

export default function ForgetPassword() {
	const [email, setEmail] = useState("");
	const [message, setMessage] = useState("");

	const API_URL = "https://emergencylocation.onrender.com/api";

	const isValidEmail = (email) => {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regex.test(email);
	};

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

	return (
		<div className='auth'>
			<img
				className='login_logo'
				src='https://png.pngtree.com/png-vector/20230413/ourmid/pngtree-3d-location-icon-clipart-in-transparent-background-vector-png-image_6704161.png'
				alt='Location icon'
			/>

			<div className='login_container'>
				<h1>Forgot Password</h1>

				{/* Display message */}
				{message && <p className='successMessage'>{message}</p>}

				<form
					className='form'
					onSubmit={handleForgetPassword}>
					<h5>E-mail</h5>
					<input
						type='email'
						placeholder='Enter your email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<button
						type='submit'
						className='login_signInButton'>
						Send Reset Link
					</button>
				</form>

				<p className='backToLogin'>
					<Link to='/'>Back to Login</Link>
				</p>
			</div>
		</div>
	);
}
