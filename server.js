// Import required packages
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user.js");
const adminRoutes = require("./routes/admin.js");
const { DB_url } = require("./config/keys.js");
const cors = require("cors");

// Initialize Express app
const app = express();

// Connect to MongoDB database
mongoose
  .connect(DB_url)
  .then(() => {
    console.log("connected to database!!!");
  })
  .catch((err) => {
    console.log("error:", err.message);
  });

// Setup middlewares
app.use(cors()); // Enable CORS
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded data
app.use(express.json()); // Parse JSON data

// Setup routes
app.use("/user", userRoutes); // User-related routes
app.use("/admin", adminRoutes); // Admin-related routes

// Start server
const port = process.env.PORT || 5500;
app.listen(port, () => {
  console.log(`app is running on port ${port}`);
});
