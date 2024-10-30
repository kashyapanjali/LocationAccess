import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./LiveLocation.css"; // Import the CSS file

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

function LiveLocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [hasSent, setHasSent] = useState(false);
  const [token, setToken] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [accessedLocation, setAccessedLocation] = useState(null);
  const userId = localStorage.getItem("userId");

  const sendLocationToBackend = useCallback(
    async (currentLocation) => {
      if (!currentLocation || !userId) {
        console.error("Missing location data or User ID");
        return;
      }
      if (hasSent) {
        console.log("Location update already sent. Waiting for a new click.");
        return;
      }

      try {
        setIsSending(true); // Start loading state
        await axios.post("http://localhost:3000/api/location", {
          ...currentLocation,
          userid: userId,
        });
        console.log("Location sent to server:", currentLocation);
      } catch (error) {
        console.error("Error sending location to server:", error);
      } finally {
        setIsSending(false); // End loading state
      }
    },
    [hasSent, userId]
  ); // Added hasSent and userId to dependencies

  const getCurrentLocationAndSend = useCallback(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        sendLocationToBackend(currentLocation);
      },
      (error) => {
        setError(`Error getting current location: ${error.message}`);
      }
    );
  }, [sendLocationToBackend]); // Added sendLocationToBackend to dependencies

  useEffect(() => {
    localStorage.setItem("userId", "1"); // Replace "test-user-id" with an actual test ID

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(newLocation);
      },
      (error) => {
        setError(`Error: ${error.message}`);
      }
    );

    // WebSocket connection
    const ws = new WebSocket("ws://localhost:3000");

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (
        message.type === "callFunction" &&
        message.functionName === "updateLocation"
      ) {
        getCurrentLocationAndSend(); // Fetch and send the current location
        console.log("Backend requested location update");
      }
    };

    // Cleanup function
    return () => {
      navigator.geolocation.clearWatch(watchId);
      ws.close();
    };
  }, [getCurrentLocationAndSend]); // Added getCurrentLocationAndSend to dependencies

  // Reset hasSent state when the button is clicked again
  const handleButtonClick = () => {
    setHasSent(false); // Reset state to allow a new send
    getCurrentLocationAndSend(); // Get the current location and send it
  };

  const generateToken = () => {
    if (!location) {
      setError("Please allow location access to generate a token");
      return;
    }
    const randomToken = Math.random().toString(36).substring(2, 15);
    setToken(
      `${randomToken}-${location.latitude.toFixed(
        4
      )}-${location.longitude.toFixed(4)}`
    );
  };

  const copyTokenToClipboard = () => {
    navigator.clipboard.writeText(token);
  };

  const accessTokenLocation = async () => {
    if (!accessToken) {
      setError("Please enter a valid token");
      return;
    }

    const tokenParts = accessToken.split("-");
    if (tokenParts.length !== 3) {
      setError("Invalid token format");
      return;
    }

    const latitude = parseFloat(tokenParts[1]);
    const longitude = parseFloat(tokenParts[2]);

    // Set the accessed location based on the token
    setAccessedLocation({ latitude, longitude });
  };

  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!location) return <div>Loading location...</div>;

  return (
    <div className="live-location-container">
      <h2 className="live-location-header">
        <img
          src="https://png.pngtree.com/png-vector/20230413/ourmid/pngtree-3d-location-icon-clipart-in-transparent-background-vector-png-image_6704161.png"
          alt="Location icon"
        />
        Live Location
      </h2>

      {/* Display accessed location if available */}
      {accessedLocation && (
        <div>
          <p>Accessed Location Latitude: {accessedLocation.latitude}</p>
          <p>Accessed Location Longitude: {accessedLocation.longitude}</p>
        </div>
      )}

      <p>Yours Latitude: {location.latitude}</p>
      <p>Yours Longitude: {location.longitude}</p>
      <button
        onClick={handleButtonClick}
        disabled={isSending}
        className="live-location-button"
        style={{ marginBottom: "10px" }}
      >
        {isSending ? "Sending..." : "Send Current Location to Backend"}
      </button>
      <div className="button-container">
        {/* generate token to give others for showing your location */}
        <div className="button-container1">
          <button onClick={generateToken} className="live-location-button">
            Generate Token
          </button>
          <div className="mt-4">
            <label htmlFor="token" className="text">
              Generated Token
            </label>
            <div className="token-input-container1">
              <input
                id="token"
                value={token}
                readOnly
                placeholder="Token will appear here"
                className="border rounded p-2 w-full"
              />
              <button
                onClick={copyTokenToClipboard}
                title="Copy to clipboard"
                className="copy-button"
              >
                Copy
              </button>
            </div>
          </div>
        </div>

        {/* Access live location through token button 2 */}
        <div className="button-container2">
          <button
            onClick={accessTokenLocation}
            className="live-location-button"
          >
            Access Token
          </button>
          <div className="mt-4">
            <label htmlFor="access-token" className="text">
              Show live location
            </label>
            <div className="token-input-container2">
              <input
                id="access-token"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="Paste here"
                className="border rounded p-2 w-full"
              />
              <button title="Paste to clipboard" className="paste-button">
                Paste
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="map-container">
        <MapContainer
          center={
            accessedLocation
              ? [accessedLocation.latitude, accessedLocation.longitude]
              : [location.latitude, location.longitude]
          }
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker
            position={
              accessedLocation
                ? [accessedLocation.latitude, accessedLocation.longitude]
                : [location.latitude, location.longitude]
            }
          >
            <Popup>
              {accessedLocation ? "Accessed location" : "Your current location"}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

export default LiveLocation;
