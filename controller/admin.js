// Import required services and validations
const Admin = require("../services/admin.js");
const Product = require("../services/product.js");
const Order = require("../services/orders.js");
const validateSignupInput = require("../validation/adminSignup.js");
const validateAmount = require("../validation/addToBalance.js");
const flutterWave = require("flutterwave-node-v3");
const {
  flutterwavePublicKey,
  flutterwaveSecretKey,
} = require("../config/keys.js");

// Initialize Flutterwave instance
const flw = new flutterWave(flutterwavePublicKey, flutterwaveSecretKey);

// Handle admin registration
const signup = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  // Validate input data
  const { error, isValid } = validateSignupInput(req.body);
  if (!isValid) {
    return res.status(400).json(error);
  }

  // Check if admin already exists
  const adminAlreadyExist = await Admin.findOneByEmail(email);
  if (adminAlreadyExist) {
    return res.json({
      status: "Fail!!",
      msg: "admin already exist with this email try Login",
    });
  }

  // Create new admin
  const createdAdmin = await Admin.create(firstname, lastname, email, password);
  if (createdAdmin.status === "error") {
    return res.json(createdAdmin);
  }

  // Generate JWT token and return success response
  const signtoken = Admin.signToken(createdAdmin);
  return res.json({
    status: "success",
    msg: "Admin created",
    userToken: signtoken,
  });
};

// Get admin profile information
const profile = (req, res) => {
  res.json({
    msg: "admin profile",
    admin: req.user,
  });
};
// Add amount to available dollar balance
const addToAvaliableBalance = async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate amount input
    const { error, errorStatus } = validateAmount(req.body);
    if (errorStatus) {
      return res.status(400).json(error);
    }

    // Update dollar balance by adding amount
    const balanceUpdate = await Product.updateDollarBalance(amount, "add");
    console.log("balance", balanceUpdate);
    res.json({
      status: "success",
      msg: "avalableDollarBalance Updated successfuly",
      product: balanceUpdate,
    });
  } catch (err) {
    res.json({
      status: "fail!!",
      msg: err.message,
      err,
    });
  }
};

// Remove amount from available dollar balance
const removeFromAvaliableBalance = async (req, res) => {
  try {
    const { amount } = req.body;

    // Validate amount input
    const { error, errorStatus } = validateAmount(req.body);
    if (errorStatus) {
      return res.status(400).json(error);
    }

    // Update dollar balance by removing amount
    Product.updateDollarBalance(amount, "remove").then((data) => {
      res.json({
        status: "success",
        msg: "avalableDollarBalance Updated successfuly",
        product: data,
      });
    });
  } catch (err) {
    res.json({
      status: "fail!!",
      msg: err.message,
      err,
    });
  }
};

// Change the Naira exchange rate
const changeNairaRate = async (req, res) => {
  try {
    const { rate } = req.body;

    // Validate rate input (using amount validator)
    const validate = {
      amount: rate,
    };
    const { error, errorStatus } = validateAmount(validate);
    if (errorStatus) {
      return res.status(400).json(error);
    }

    // Update Naira rate
    Product.changeNairaRate(rate).then((data) => {
      res.json({
        status: "success",
        msg: "naira rate Updated successfuly",
        product: data,
      });
    });
  } catch (err) {
    res.json({
      status: "fail!!",
      msg: err.message,
      err,
    });
  }
};

// Get all pending orders
const getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.findPendingOrders();
    res.json(orders);
  } catch (err) {
    res.json({
      status: "fail!!",
      msg: err.message,
      err,
    });
  }
};
// Approve a pending order after payment verification
const approvePendingOrder = async (req, res) => {
  try {
    const { user } = req.body;

    // Find user's pending order
    const userPendingOrder = await Order.findUserPending(user);
    if (!userPendingOrder) {
      return res.json({
        status: "fail",
        msg: "no pending orders for this user",
      });
    }

    // Verify payment with Flutterwave
    const verifytransaction = await flw.Transaction.verify({
      id: userPendingOrder.paymentId,
    });

    if (verifytransaction.status == "success") {
      // Remove amount from locked balance and approve order
      await Product.updateLockBalance(
        userPendingOrder.amountInDollar,
        "remove"
      );
      Order.updateOrderStatus(user, "success").then((data) => {
        return res.json({
          status: "success",
          msg: "payment approved successfuly !",
          order: data,
        });
      });
    } else {
      return res.json({
        status: "fail",
        msg: "payment not confirmed!!",
        data: verifytransaction,
      });
    }
  } catch (err) {
    res.json({
      status: "fail!!",
      msg: err.message,
      err,
    });
  }
};

// Decline a pending order and restore balances
const declinePendingOrder = async (req, res) => {
  try {
    const { user } = req.body;

    // Find user's pending order
    const userPendingOrder = await Order.findUserPending(user);
    if (!userPendingOrder) {
      return res.json({
        status: "fail",
        msg: "no pending orders for this user",
      });
    }

    // Restore balances and decline order
    await Product.updateLockBalance(userPendingOrder.amountInDollar, "remove");
    await Product.updateDollarBalance(userPendingOrder.amountInDollar, "add");
    Order.updateOrderStatus(user, "failed").then((data) => {
      return res.json({
        status: "success",
        msg: "payment declined!",
        order: data,
      });
    });
  } catch (err) {
    res.json({
      status: "fail!!",
      msg: err.message,
      err,
    });
  }
};

// Delete a pending order
const deletePendingOrder = async (req, res) => {
  try {
    const { user } = req.body;
    await Order.deleteOrder(user).then((data) => {
      res.json(data);
    });
  } catch (err) {
    res.json({
      status: "fail!!",
      msg: err.message,
      err,
    });
  }
};

// Get all orders (pending and completed)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAllOrders();
    res.json(orders);
  } catch (err) {
    res.json({
      status: "fail!!",
      msg: err.message,
      err,
    });
  }
};

// Handle admin login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const foundUser = await Admin.findOneByEmail(email);
    if (foundUser) {
      // Validate password
      const validatePassword = await foundUser.PasswordValid(password);
      if (validatePassword) {
        return res.json({
          status: "success",
          msg: "Login successfuly",
          token: Admin.signToken(foundUser),
        });
      } else {
        return res.json({
          status: "falied",
          msg: "password not currect",
        });
      }
    } else {
      return res.json({
        status: "failed",
        msg: "no user with this email try signin up",
      });
    }
  } catch (err) {
    return res.json({
      status: "error",
      msg: err.message,
    });
  }
};

// Test admin token validity
const testToken = (req, res) => {
  return res.json({
    msg: "testing",
    foundUser: req.user,
  });
};

// Export all admin controller functions
module.exports = {
  signup,
  login,
  profile,
  addToAvaliableBalance,
  removeFromAvaliableBalance,
  changeNairaRate,
  getAllOrders,
  getPendingOrders,
  approvePendingOrder,
  declinePendingOrder,
  deletePendingOrder,
  testToken,
};
