import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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
  // State for button loading state
  const [isSending, setIsSending] = useState(false);
  // To track if update was sent
  const [hasSent, setHasSent] = useState(false);
  // Get user ID from localStorage
  const userId = localStorage.getItem("userId");

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
        // sendLocationToBackend(newLocation);
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
  }, []);

  const sendLocationToBackend = async (currentLocation) => {
    if (!currentLocation || !userId) {
      console.error("Missing location data or User ID");
      return;
    }
    // Check if a previous update was sent
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
  };

  const getCurrentLocationAndSend = () => {
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
  };

  // Reset hasSent state when the button is clicked again
  const handleButtonClick = () => {
    setHasSent(false); // Reset state to allow a new send
    getCurrentLocationAndSend(); // Get the current location and send it
  };

  if (error) return <div>Error: {error}</div>;
  if (!location) return <div>Loading location...</div>;

  return (
    <div>
      <h2>Live Location</h2>
      <p>Latitude: {location.latitude}</p>
      <p>Longitude: {location.longitude}</p>
      <button onClick={handleButtonClick} disabled={isSending}>
        {isSending ? "Sending..." : "Send Current Location to Backend"}
      </button>
      <div style={{ height: "400px", width: "100%", marginTop: "20px" }}>
        <MapContainer
          center={[location.latitude, location.longitude]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[location.latitude, location.longitude]}>
            <Popup>Your current location</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}

export default LiveLocation;
