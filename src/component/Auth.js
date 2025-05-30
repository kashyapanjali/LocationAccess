import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import "./Auth.css";
import api from "../config";

export default function Auth() {
	const [username, setUserName] = useState("");
	const [isSignUp, setIsSignUp] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const navigate = useNavigate();

	// Email validation function
	const isValidEmail = (email) => {
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return regex.test(email);
	};

	// Password validation function with atleast 6 characters
	const isValidPassword = (password) => {
		const regex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
		return regex.test(password);
	};

	// For submit when user signs in and up as well
	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!isValidEmail(email)) {
			setMessage("Please enter a valid email address.");
			return;
		}

		if (!isValidPassword(password)) {
			setMessage(
				"Password must be at least 6 characters long, and include at least one uppercase letter, one lowercase letter, one number, and one special character."
			);
			return;
		}
		// Sign up user here
		if (isSignUp) {
			try {
				await api.post('/register', {
					username,
					email,
					password,
				});

				setMessage("Sign-up successful! You can now sign in.");
				setIsSignUp(false);
			} catch (error) {
				if (error.message.includes('Network error')) {
					setMessage("Unable to connect to the server. Please check your internet connection and try again.");
				} else {
					setMessage("Error signing up. Please try again.");
				}
				console.error("Sign-up error:", error);
			}
		} else {
			// Sign in user
			try {
				const response = await api.post('/login', {
					email,
					password,
				});
				
				// Generate a temporary userId if missing from response
				let userId = response.data.userId;
				
				if (!userId) {
					console.warn("No userId in login response - using email hash as temporary ID");
					// Create a simple hash of the email to use as userId
					userId = email.split('').reduce((acc, char) => {
						return acc + char.charCodeAt(0);
					}, 0);
				}
				
				setMessage("Sign-in successful! Welcome back.");

				// Save userId in localStorage
				localStorage.setItem("userId", userId);
				localStorage.setItem("username", response.data.username || email.split('@')[0]);

				// Redirect to location page after successful login
				navigate("/location");
			} catch (error) {
				if (error.message.includes('Network error')) {
					setMessage("Unable to connect to the server. Please check your internet connection and try again.");
				} else {
					setMessage("Invalid email or password. Please try again.");
				}
				console.error("Sign-in error:", error);
			}
		}
	};

	const toggleForm = () => {
		setMessage("");
		setIsSignUp((prev) => !prev);
	};

	return (
		<div className='auth'>
			<img
				className='login_logo'
				src='https://png.pngtree.com/png-vector/20230413/ourmid/pngtree-3d-location-icon-clipart-in-transparent-background-vector-png-image_6704161.png'
				alt='Location icon'
			/>

			<div className='login_container'>
				<h1>{isSignUp ? " Sign Up" : "Sign In"}</h1>

				{message && <p className='successMessage'>{message}</p>}

				<form
					className='form'
					onSubmit={handleSubmit}>
					{isSignUp && (
						<>
							<h5>Username</h5>
							<input
								type='text'
								placeholder='Enter your username'
								value={username}
								onChange={(e) => setUserName(e.target.value)}
								required
							/>
						</>
					)}

					<h5>E-mail</h5>
					<input
						type='email'
						placeholder='Enter your email'
						value={email}
						onChange={(e) => setEmail(e.target.value)} // Update email
						required
					/>

					<h5>Password</h5>
					<input
						type='password'
						placeholder='Enter your password'
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>

					<button
						type='submit'
						className='login_signInButton'>
						{isSignUp ? "Sign Up" : "Sign In"}
					</button>
					<p className='forgetPass'>
						<Link
							className='linkpass'
							to='/forget-password'>
							Forget Password
						</Link>
					</p>
				</form>
				<Link
					className='otpMain'
					to='/otp'>
					OTP Generate
				</Link>
				<p className='des'>
					By {isSignUp ? "signing up" : "signing in"}, you agree to our Terms
					and Conditions for accessing location data.
				</p>
				<button
					type='button'
					className='toggleButton'
					onClick={toggleForm}>
					{isSignUp ?
						"Already have an account? Sign In"
					:	"New here? Create an account"}
				</button>
			</div>
		</div>
	);
}
