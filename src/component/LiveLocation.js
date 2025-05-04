import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./LiveLocation.css";
import { useNavigate } from "react-router-dom";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
	iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
	iconUrl: require("leaflet/dist/images/marker-icon.png"),
	shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Define a custom icon for the accessed location
const accessedLocationIcon = new L.Icon({
	iconUrl: `${process.env.PUBLIC_URL}/red-marker-icon.png`,
	iconSize: [25, 41],
	iconAnchor: [12, 41],
	popupAnchor: [1, -34],
});

function LiveLocation() {
	const [location, setLocation] = useState(null);
	const [locationName, setLocationName] = useState("");
	const [accessedLocation, setAccessedLocation] = useState(null);
	const [accessedLocationName, setAccessedLocationName] = useState("");
	const [error, setError] = useState(null);
	// const [isSending, setIsSending] = useState(false);
	const [token, setToken] = useState("");
	const [accessToken, setAccessToken] = useState("");
	const [username, setUsername] = useState("");
	const userId = localStorage.getItem("userId");
	const navigate = useNavigate();
	// const API_URL = "http://13.203.227.147/api";

	// Validate userId when component loads
	useEffect(() => {
		if (!userId) {
			console.error("No userId found in localStorage");
			navigate("/");
			return;
		}
		
		// Validate userId format
		const parsedUserId = parseInt(userId, 10);
		if (isNaN(parsedUserId)) {
			console.error("Invalid userId in localStorage:", userId);
			localStorage.removeItem("userId");
			navigate("/");
			return;
		}
		
		console.log("Valid userId:", parsedUserId);
	}, [userId, navigate]);

	// Retrieve username from localStorage
	useEffect(() => {
		const storedUsername = localStorage.getItem("username");
		if (storedUsername) {
			setUsername(storedUsername);
			console.log("Username retrieved from localStorage:", storedUsername);
		} else {
			console.log("No username found in localStorage.");
		}
	}, []);

	// Fetch location name using a geocoding API
	const getLocationName = async (latitude, longitude) => {
		try {
			const response = await axios.get(
				//use external api
				`https://nominatim.openstreetmap.org/reverse`,
				{
					params: {
						lat: latitude,
						lon: longitude,
						format: "json",
					},
				}
			);
			return response.data.display_name || "Unknown Location";
		} catch (error) {
			console.error("Error fetching location name:", error);
			return "Unknown Location";
		}
	};

	const sendLocationToBackend = useCallback(
		async (currentLocation) => {
			if (!currentLocation) {
				console.error("Missing location data");
				return;
			}
			
			// Use a fallback ID for testing until backend is fixed
			// Replace '1' with an actual user ID from your database
			const fallbackId = 1; 
			const userIdToUse = userId || fallbackId.toString();
			
			try {
				// Convert userId to integer and coordinates to float
				const parsedUserId = parseInt(userIdToUse, 10);
				
				// Check if userId is a valid number
				if (isNaN(parsedUserId)) {
					console.error("Invalid userId format:", userIdToUse);
					return;
				}
				
				// Create payload with detailed logging
				const payload = {
					userid: parsedUserId,
					latitude: parseFloat(currentLocation.latitude),
					longitude: parseFloat(currentLocation.longitude),
				};
				
				console.log("Sending location payload:", JSON.stringify(payload));
				
				const response = await axios.post("http://13.203.227.147/api/location", payload);
				
				console.log("Location update response:", response.data);
				console.log("Location sent to server:", currentLocation);
			} catch (error) {
				console.error("Error sending location to server:", error);
				if (error.response) {
					console.error("Error response:", error.response.data);
					console.error("Error status:", error.response.status);
					
					// Check if we can get more details from the error
					if (error.response.data && error.response.data.details) {
						console.error("Error details:", error.response.data.details);
					}
				} else if (error.request) {
					console.error("No response received:", error.request);
				} else {
					console.error("Error message:", error.message);
				}
			}
		},
		[userId]
	);

	useEffect(() => {
		if (!navigator.geolocation) {
			setError("Geolocation is not supported by your browser");
			return;
		}

		const watchId = navigator.geolocation.watchPosition(
			async (position) => {
				const newLocation = {
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				};
				setLocation(newLocation);

				const name = await getLocationName(
					newLocation.latitude,
					newLocation.longitude
				);
				setLocationName(name);

				sendLocationToBackend(newLocation);
			},
			(error) => {
				setError(`Error: ${error.message}`);
			}
		);

		const ws = new WebSocket("wss://13.203.227.147");
		ws.onmessage = (event) => {
			const message = JSON.parse(event.data);
			if (message.type === "locationUpdate") {
				console.log(
					"Received location update from WebSocket:",
					message.location
				);
				setAccessedLocation(message.location);
			}
		};

		return () => {
			navigator.geolocation.clearWatch(watchId);
			ws.close();
		};
	}, [sendLocationToBackend]);

	const generateToken = async () => {
		if (!location) {
			setError("Please allow location access to generate a token");
			return;
		}
		
		// Use a fallback ID for testing until backend is fixed
		// Replace '1' with an actual user ID from your database
		const fallbackId = 1; 
		const userIdToUse = userId || fallbackId.toString();
		
		// Convert userId to integer
		const parsedUserId = parseInt(userIdToUse, 10);
		
		// Check if userId is a valid number
		if (isNaN(parsedUserId)) {
			console.error("Invalid userId format:", userIdToUse);
			setError("Invalid user ID format. Please log in again.");
			navigate("/");
			return;
		}

		try {
			// Create payload with detailed logging
			const payload = {
				userid: parsedUserId,
				location: {
					latitude: parseFloat(location.latitude),
					longitude: parseFloat(location.longitude),
				},
			};
			
			console.log("Sending token request payload:", JSON.stringify(payload));

			const response = await axios.post("http://13.203.227.147/api/token", payload);

			console.log("Token response:", response.data);
			setToken(response.data.token);
			console.log("Generated token:", response.data.token);
			setError(null);
		} catch (error) {
			console.error("Error generating token:", error);
			if (error.response) {
				console.error("Error response:", error.response.data);
				console.error("Error status:", error.response.status);
				
				// Check if we can get more details from the error
				if (error.response.data && error.response.data.details) {
					console.error("Error details:", error.response.data.details);
				}
				
				setError(`Failed to generate token: ${error.response.data.message || 'Unknown error'}`);
			} else if (error.request) {
				console.error("No response received:", error.request);
				setError("Failed to connect to the server. Please check your internet connection.");
			} else {
				console.error("Error message:", error.message);
				setError("Failed to generate token. Please try again later.");
			}
		}
	};

	const copyTokenToClipboard = () => {
		navigator.clipboard.writeText(token);
	};

	const accessTokenLocation = async () => {
		if (!accessToken) {
			setError("Please enter a valid token");
			return;
		}

		try {
			const response = await axios.get(
				`http://13.203.227.147/api/location/${accessToken}`
			);
			const newLocation = {
				latitude: response.data.latitude,
				longitude: response.data.longitude,
			};
			setAccessedLocation(newLocation);

			const name = await getLocationName(
				newLocation.latitude,
				newLocation.longitude
			);
			setAccessedLocationName(name);
		} catch (error) {
			console.error("Error accessing location:", error);
			setError("Failed to access location. Ensure the token is valid.");
		}
	};

	const pasteTokenFromClipboard = async () => {
		try {
			const text = await navigator.clipboard.readText();
			setAccessToken(text);
		} catch (error) {
			setError("Failed to paste token from clipboard.");
			console.error("Paste error:", error);
		}
	};

	const handleLogout = () => {
		// remove userid
		localStorage.removeItem("userId");
		localStorage.removeItem("username");
		navigate("/");
	};

	if (error) return <div className='text-red-500'>Error: {error}</div>;
	if (!location) return <div>Loading location...</div>;

	return (
		<div className='main'>
			<div className='navbar-body'>
				<p className='usersname'>Welcome, {username}!</p>
				<h2 className='live-location-header'>
					<img
						src='https://png.pngtree.com/png-vector/20230413/ourmid/pngtree-3d-location-icon-clipart-in-transparent-background-vector-png-image_6704161.png'
						alt='Location icon'
					/>
					Live Location
				</h2>
				<p
					className='logoutbutton'
					style={{ cursor: "pointer", color: "red" }}
					onClick={handleLogout}>
					Logout
				</p>
			</div>
			<div className='live-location-container'>
				{accessedLocationName && (
					<div>
						<p>Accessed Location: {accessedLocationName}</p>
					</div>
				)}
				<p>Your Location: {locationName}</p>
				<div className='button-container'>
					<div className='button-group'>
						<button
							onClick={generateToken}
							className='live-location-button'>
							Generate Token
						</button>
						<div className='token-input-container'>
							<input
								id='token'
								value={token}
								readOnly
								placeholder='Token will appear here'
								className='input-field'
							/>
							<button
								onClick={copyTokenToClipboard}
								title='Copy to clipboard'
								className='action-button'>
								Copy
							</button>
						</div>
					</div>
					<div className='button-group'>
						<button
							onClick={accessTokenLocation}
							className='live-location-button'>
							Access Token
						</button>
						<div className='token-input-container'>
							<input
								id='access-token'
								value={accessToken}
								onChange={(e) => setAccessToken(e.target.value)}
								placeholder='Paste here'
								className='input-field'
							/>
							<button
								title='Paste from clipboard'
								className='action-button'
								onClick={pasteTokenFromClipboard}>
								Paste
							</button>
						</div>
					</div>
				</div>
				<div className='map-container'>
					<MapContainer
						center={
							accessedLocation ?
								[accessedLocation.latitude, accessedLocation.longitude]
							:	[location.latitude, location.longitude]
						}
						zoom={13}
						style={{ height: "100%", width: "100%" }}>
						<TileLayer
							url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
							attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
						/>
						{accessedLocation && (
							<Marker
								position={[
									accessedLocation.latitude,
									accessedLocation.longitude,
								]}
								icon={accessedLocationIcon}>
								<Popup>
									{accessedLocationName ?
										accessedLocationName
									:	"Accessed Location"}
								</Popup>
							</Marker>
						)}
						{location && (
							<Marker position={[location.latitude, location.longitude]}>
								<Popup>{locationName}</Popup>
							</Marker>
						)}
					</MapContainer>
				</div>
			</div>
		</div>
	);
}

export default LiveLocation;
