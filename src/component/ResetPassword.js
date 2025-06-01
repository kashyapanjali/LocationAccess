import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import "./ForgetPassword.css";
import axios from "axios";

export default function ResetPassword() {
	const { token } = useParams(); // Extract token from URL params
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [retryCount, setRetryCount] = useState(0);
	const API_URL = "https://brainbrief.in/api";
	const navigate = useNavigate();


	const passwordStrengthRegex =
		/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+={}|:";'<>?,./])[A-Za-z\d!@#$%^&*()_+={}|:";'<>?,./]{6,}$/;

	const handleResetPassword = async (e) => {
		e.preventDefault();
		setLoading(true);

		if (password !== confirmPassword) {
			setMessage("Passwords do not match.");
			setLoading(false);
			return;
		}

		if (password.length < 6) {
			setMessage("Password must be at least 6 characters long.");
			setLoading(false);
			return;
		}

		if (!passwordStrengthRegex.test(password)) {
			setMessage(
				"Password must contain at least one letter, one number, and one special character."
			);
			setLoading(false);
			return;
		}

		try {
			// Add request body debug info without showing actual password
			const payload = { newPassword: password };
			
			const response = await axios.post(`${API_URL}/reset-password/${token}`, payload, {
				headers: {
					'Content-Type': 'application/json'
				}
			});
			
			setMessage(
				response.data.message || "Password has been successfully reset!"
			);
			setLoading(false);
			setTimeout(() => navigate("/"), 2000);
		} catch (error) {
			console.error("Reset password error:", error);
			setLoading(false);
			
			if (error.response) {
				if (error.response.status === 404) {
					setMessage("Reset token not found or has expired.");
				} else if (error.response.status === 400) {
					setMessage(error.response.data.message || "Invalid password format.");
				} else if (error.response.status === 500) {
					// For server errors, provide more detailed information
					const serverMessage = error.response.data?.message || "Unknown server error";
					setMessage(`Server error (500): ${serverMessage}. The server might be experiencing issues. Please try again later.`);
					
					// If we've tried less than 3 times, offer a retry button
					if (retryCount < 3) {
						setMessage(`Server error (500): ${serverMessage}. Click 'Retry' to try again.`);
					}
				} else {
					setMessage(
						error.response.data?.message ||
						"Error resetting password. Please try again."
					);
				}
			} else if (error.request) {
				setMessage("Failed to connect to the server. Please check your internet connection.");
			} else {
				setMessage("Error resetting password. Please try again.");
			}
		}
	};
	
	const handleRetry = () => {
		setRetryCount(prevCount => prevCount + 1);
		handleResetPassword({ preventDefault: () => {} });
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
						className='login_signInButton'
						disabled={loading}>
						{loading ? "Processing..." : "Reset Password"}
					</button>
					
					{/* Show retry button for server errors */}
					{retryCount > 0 && retryCount < 3 && (
						<button 
							type="button"
							onClick={handleRetry}
							className='login_signInButton'
							disabled={loading}
							style={{ marginTop: '10px', backgroundColor: '#f0c14b' }}>
							{loading ? "Retrying..." : "Retry"}
						</button>
					)}
				</form>

				<p className='backToLogin'>
					<Link to='/'>Back to Login</Link>
				</p>
			</div>
		</div>
	);
}
