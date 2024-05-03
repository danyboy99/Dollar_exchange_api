const express = require("express");
const userController = require("../controller/user.js");
const validateToken = require("../config/tokenValidation.js");
const passport = require("passport");
const router = express.Router();
router.post("/signup", userController.signUp);
router.post("/login", userController.login);
router.get("/profile", validateToken.signUser, userController.profile);

router.post("/placeorder", validateToken.signUser, userController.placeOrder);

router.post("/otp-checkout", validateToken.signUser, userController.checkOut);
router.post("/testtoken", validateToken.signUser, userController.testToken);
module.exports = router;
