const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
// const testRoutes = require("./routes/test");
const cors = require("cors"); // Enable cross-origin requests

const app = express();

//Middleware
app.use(cors()); // Allow requests from other origins
app.use(bodyParser.json()); //parse Json bodies

//Routes
//Use auth routes
app.use("/api/auth", authRoutes);

// Test route to handle frontend requests
// app.use("/api/test", testRoutes);

//Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
