import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";
import "./Otp.css";

function Otp() {
	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState("");
	const [message, setMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const API_URL = "https://13.203.227.147/api";
	const navigate = useNavigate();

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

		setLoading(true);
		try {
			await axios.post(`${API_URL}/send-otp`, { email }, {
				timeout: 10000, // 10 second timeout
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			});
			setMessage("OTP sent to your email!");
		} catch (error) {
			if (error.code === 'ECONNABORTED') {
				setMessage("Connection timed out. Please check your internet connection and try again.");
			} else if (!error.response) {
				setMessage("Network error. Please check your internet connection and try again.");
			} else {
				setMessage("Error sending OTP. Please try again.");
			}
			console.error(
				"Send OTP error:",
				error.response ? error.response.data : error.message
			);
		} finally {
			setLoading(false);
		}
	};

	const handleVerifyOtp = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(`${API_URL}/verify-otp`, {
				email,
				otp,
			}, {
				timeout: 10000, // 10 second timeout
				headers: {
					'Content-Type': 'application/json',
					'Accept': 'application/json'
				}
			});
			
			// Generate a temporary userId if missing from response
			let userId = response.data.userId;
			
			if (!userId) {
				console.warn("No userId in OTP response - using email hash as temporary ID");
				// Create a simple hash of the email to use as userId
				userId = email.split('').reduce((acc, char) => {
					return acc + char.charCodeAt(0);
				}, 0);
			}
			
			setMessage(response.data.message || "OTP verified successfully!");

			// Save user ID in localStorage
			localStorage.setItem("userId", userId);
			localStorage.setItem("username", response.data.username || email.split('@')[0]);

			navigate("/location");
		} catch (error) {
			setMessage("Error verifying OTP. Please try again.");
			console.error(
				"Verify OTP error:",
				error.response ? error.response.data : error.message
			);
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
				<h1>OTP Authentication</h1>
				<form
					className='form'
					onSubmit={handleSendOtp}>
					<h5>Email</h5>
					<input
						type='email'
						placeholder='Enter your email'
						className='email_input'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
					<button
						className='otp_generate'
						disabled={loading}>
						{loading ? "Sending..." : "Request OTP"}
					</button>
				</form>
				<form
					className='form'
					onSubmit={handleVerifyOtp}>
					<h5>OTP</h5>
					<input
						type='text'
						placeholder='Enter OTP'
						className='otp_input'
						value={otp}
						onChange={(e) => setOtp(e.target.value)}
						required
					/>
					<button className='verify_button'>Verify OTP</button>
				</form>
				{message && <p className='message'>{message}</p>}{" "}
				{/* Display messages */}
				<Link
					className='home'
					to='/'>
					SignInUp
				</Link>
			</div>
		</div>
	);
}

export default Otp;
