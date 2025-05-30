import { Link, useNavigate } from "react-router-dom";
import React, { useState} from "react";
import "./Auth.css";
import axios from "axios";

// Add axios interceptor for retries
axios.interceptors.response.use(undefined, async (err) => {
	const { config } = err;
	if (!config || !config.retry) {
		return Promise.reject(err);
	}
	
	config.retryCount = config.retryCount || 0;
	
	if (config.retryCount >= config.retry) {
		return Promise.reject(err);
	}
	
	config.retryCount += 1;
	
	// Create new promise to handle retry
	const backoff = new Promise((resolve) => {
		setTimeout(() => {
			resolve();
		}, config.retryDelay || 1000);
	});
	
	// Return the promise in which recalls axios to retry the request
	await backoff;
	return axios(config);
});

export default function Auth() {
	const [username, setUserName] = useState("");
	const [isSignUp, setIsSignUp] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const navigate = useNavigate();

	const API_URL = "https://13.203.227.147/api";

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
				await axios.post(`${API_URL}/register`, {
					username,
					email,
					password,
				}, {
					timeout: 30000, // Increased to 30 seconds
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json'
					},
					retry: 3, // Add retry attempts
					retryDelay: 1000 // Wait 1 second between retries
				});

				setMessage("Sign-up successful! You can now sign in.");
				setIsSignUp(false);
			} catch (error) {
				if (error.code === 'ECONNABORTED') {
					setMessage("Server is taking too long to respond. Please try again in a few moments.");
				} else if (!error.response) {
					setMessage("Network error. Please check your internet connection and try again.");
				} else {
					setMessage("Error signing up. Please try again.");
				}
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
				}, {
					timeout: 30000, // Increased to 30 seconds
					headers: {
						'Content-Type': 'application/json',
						'Accept': 'application/json'
					},
					retry: 3, // Add retry attempts
					retryDelay: 1000 // Wait 1 second between retries
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
				setMessage("Invalid email or password. Please try again.");
				console.error("Sign-in error:", error);
				if (error.response) {
					console.error("Error response:", error.response.data);
				}
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
