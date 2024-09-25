const express = require("express");
const router = express.Router();
const { submitText } = require("../controllers/testControllers");

//port route for handling form submission
router.post("/submit", submitText);

module.exports = router;
