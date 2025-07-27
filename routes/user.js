// Import required packages
const express = require("express");
const userController = require("../controller/user.js");
const validateToken = require("../config/tokenValidation.js");
const passport = require("passport");

// Create router instance
const router = express.Router();

// User authentication routes
router.post("/signup", userController.signUp); // User registration
router.post("/login", userController.login); // User login

// Protected user routes (require authentication)
router.get("/profile", validateToken.signUser, userController.profile); // Get user profile
router.post("/placeorder", validateToken.signUser, userController.placeOrder); // Place dollar order
router.post("/otp-checkout", validateToken.signUser, userController.checkOut); // Complete checkout with OTP
router.post("/testtoken", validateToken.signUser, userController.testToken); // Test token validity

// Export router
module.exports = router;
