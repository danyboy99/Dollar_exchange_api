const express = require("express");
const adminController = require("../controller/admin.js");
const productController = require("../controller/product.js");
const router = express.Router();
const passport = require("passport");

router.get("/", (req, res) => {
  res.json("working on it");
});

router.post("/create/j21", adminController.signup);
router.post(
  "/login",
  passport.authenticate("adminLogin", { session: false }),
  adminController.login
);

router.get(
  "/profile",
  passport.authenticate("adminValidate", { session: false }),
  adminController.profile
);
router.get(
  "/productinit",
  passport.authenticate("adminValidate", { session: false }),
  productController.initializeProduct
);
router.post(
  "/addtobalance",
  passport.authenticate("adminValidate", { session: false }),
  adminController.addToAvaliableBalance
);

router.post(
  "/removefrombalance",
  passport.authenticate("adminValidate", { session: false }),
  adminController.removeFromAvaliableBalance
);

router.post(
  "/changenairarate",
  passport.authenticate("adminValidate", { session: false }),
  adminController.changeNairaRate
);

router.get(
  "/pendingorders",
  passport.authenticate("adminValidate", { session: false }),
  adminController.getPendingOrders
);

router.get(
  "/allorders",
  passport.authenticate("adminValidate", { session: false }),
  adminController.getAllOrders
);

router.post(
  "/approvependingorder",
  passport.authenticate("adminValidate", { session: false }),
  adminController.approvePendingOrder
);
router.post(
  "/declinependingorder",
  passport.authenticate("adminValidate", { session: false }),
  adminController.declinePendingOrder
);
module.exports = router;
