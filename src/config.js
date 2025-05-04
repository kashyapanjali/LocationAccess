// Central configuration file for the application

const config = {
  API_BASE_URL: "/api", // Use relative URL to work with Netlify proxy
  WS_URL: "wss://13.203.227.147:3000", // WebSockets still need direct connection
  ENABLE_WEBSOCKET: true, // Always enable WebSockets
  DEBUG: true  // Enable debug mode to see more detailed error messages
};

export default config;