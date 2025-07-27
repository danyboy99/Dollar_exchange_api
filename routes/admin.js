// Import required packages
const express = require("express");
const adminController = require("../controller/admin.js");
const productController = require("../controller/product.js");
const validateToken = require("../config/tokenValidation.js");
const passport = require("passport");

// Create router instance
const router = express.Router();

// Test route
router.get("/", (req, res) => {
  res.json("working on it");
});

// Admin authentication routes
router.post("/create/j21", adminController.signup); // Admin registration (protected endpoint)
router.post("/login", adminController.login); // Admin login

// Protected admin routes (require admin authentication)
router.get("/profile", validateToken.signAdmin, adminController.profile); // Get admin profile

// Product management routes
router.get(
  "/productinit",
  validateToken.signAdmin,
  productController.initializeProduct
); // Initialize product

// Balance management routes
router.post(
  "/addtobalance",
  validateToken.signAdmin,
  adminController.addToAvaliableBalance
); // Add to available balance
router.post(
  "/removefrombalance",
  validateToken.signAdmin,
  adminController.removeFromAvaliableBalance
); // Remove from available balance

// Rate management routes
router.post(
  "/changenairarate",
  validateToken.signAdmin,
  adminController.changeNairaRate
); // Change Naira exchange rate

// Order management routes
router.get(
  "/pendingorders",
  validateToken.signAdmin,
  adminController.getPendingOrders
); // Get pending orders
router.get("/allorders", validateToken.signAdmin, adminController.getAllOrders); // Get all orders
router.post(
  "/approvependingorder",
  validateToken.signAdmin,
  adminController.approvePendingOrder
); // Approve pending order
router.post(
  "/declinependingorder",
  validateToken.signAdmin,
  adminController.declinePendingOrder
); // Decline pending order

// Test route
router.post("/testtoken", validateToken.signAdmin, adminController.testToken); // Test admin token

// Export router
module.exports = router;
