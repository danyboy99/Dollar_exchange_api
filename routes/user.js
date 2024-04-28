const express = require("express");
const userController = require("../controller/user.js");
const passport = require("passport");
const router = express.Router();
router.post("/signup", userController.signUp);
router.post(
  "/login",
  passport.authenticate("userLogin", { session: false }),
  userController.login
);
router.get(
  "/profile",
  passport.authenticate("validateUser", { session: false }),
  userController.profile
);

router.post(
  "/placeorder",
  passport.authenticate("validateUser", { session: false }),
  userController.placeOrder
);

router.post(
  "/otp-checkout",
  passport.authenticate("validateUser", { session: false }),
  userController.checkOut
);
module.exports = router;
