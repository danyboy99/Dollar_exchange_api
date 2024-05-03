const express = require("express");
const adminController = require("../controller/admin.js");
const productController = require("../controller/product.js");
const validateToken = require("../config/tokenValidation.js");
const router = express.Router();
const passport = require("passport");

router.get("/", (req, res) => {
  res.json("working on it");
});

router.post("/create/j21", adminController.signup);
router.post("/login", adminController.login);

router.get("/profile", validateToken.signAdmin, adminController.profile);
router.get(
  "/productinit",
  validateToken.signAdmin,
  productController.initializeProduct
);
router.post(
  "/addtobalance",
  validateToken.signAdmin,
  adminController.addToAvaliableBalance
);

router.post(
  "/removefrombalance",
  validateToken.signAdmin,
  adminController.removeFromAvaliableBalance
);

router.post(
  "/changenairarate",
  validateToken.signAdmin,
  adminController.changeNairaRate
);

router.get(
  "/pendingorders",
  validateToken.signAdmin,
  adminController.getPendingOrders
);

router.get("/allorders", validateToken.signAdmin, adminController.getAllOrders);

router.post(
  "/approvependingorder",
  validateToken.signAdmin,
  adminController.approvePendingOrder
);
router.post(
  "/declinependingorder",
  validateToken.signAdmin,
  adminController.declinePendingOrder
);
router.post("/testtoken", validateToken.signAdmin, adminController.testToken);
module.exports = router;
