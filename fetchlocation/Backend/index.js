const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const app = express();

//Middleware
app.use(bodyParser.json()); //parse Json bodies

//Routes
app.use("/api/auth", authRoutes); //Use auth routes

//Start server

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
