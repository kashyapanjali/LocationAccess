import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./ForgetPassword.css";
import axios from "axios";
import config from "../config";

export default function ResetPassword() {
	const { token } = useParams(); // Extract token from URL params
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [message, setMessage] = useState("");
	const navigate = useNavigate();

	const API_URL = "https://13.203.227.147/api";

	const passwordStrengthRegex =
		/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+={}|:";'<>?,./])[A-Za-z\d!@#$%^&*()_+={}|:";'<>?,./]{6,}$/;

	const handleResetPassword = async (e) => {
		e.preventDefault();

		if (password !== confirmPassword) {
			setMessage("Passwords do not match.");
			return;
		}

		if (password.length < 6) {
			setMessage("Password must be at least 6 characters long.");
			return;
		}

		if (!passwordStrengthRegex.test(password)) {
			setMessage(
				"Password must contain at least one letter, one number, and one special character."
			);
			return;
		}

		try {
			const response = await axios.post(`${API_URL}/reset-password/${token}`, {
				newPassword: password,
			});

			setMessage(
				response.data.message || "Password has been successfully reset!"
			);
			setTimeout(() => navigate("/"), 2000);
		} catch (error) {
			setMessage(
				error.response?.data?.message ||
					"Error resetting password. Please try again."
			);
			console.error("Reset password error:", error);
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
				<h1>Reset Password</h1>

				{/* Display message */}
				{message && <p className='successMessage'>{message}</p>}

				<form
					className='form'
					onSubmit={handleResetPassword}>
					<h5>New Password</h5>
					<input
						type='password'
						placeholder='Enter your new password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
					<h5>Confirm New Password</h5>
					<input
						type='password'
						placeholder='Confirm your new password'
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
					<button
						type='submit'
						className='login_signInButton'>
						Reset Password
					</button>
				</form>

				<p className='backToLogin'>
					<Link to='/'>Back to Login</Link>
				</p>
			</div>
		</div>
	);
}
