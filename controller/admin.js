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
const flw = new flutterWave(flutterwavePublicKey, flutterwaveSecretKey);

//signup route
const signup = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  const { error, isValid } = validateSignupInput(req.body);
  // check validation
  if (!isValid) {
    return res.status(400).json(error);
  }
  const adminAlreadyExist = await Admin.findOneByEmail(email);
  if (adminAlreadyExist) {
    return res.json({
      status: "Fail!!",
      msg: "admin already exist with this email try Login",
    });
  }

  const createdAdmin = await Admin.create(firstname, lastname, email, password);
  if (createdAdmin.status === "error") {
    return res.json(createdAdmin);
  }

  const signtoken = Admin.signToken(createdAdmin);
  return res.json({
    status: "success",
    msg: "Admin created",
    userToken: signtoken,
  });
};

const profile = (req, res) => {
  res.json({
    msg: "admin profile",
    admin: req.user,
  });
};
const addToAvaliableBalance = async (req, res) => {
  try {
    const { amount } = req.body;
    const { error, errorStatus } = validateAmount(req.body);
    // check validation
    if (errorStatus) {
      return res.status(400).json(error);
    }

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
const removeFromAvaliableBalance = async (req, res) => {
  try {
    const { amount } = req.body;
    const { error, errorStatus } = validateAmount(req.body);
    // check validation
    if (errorStatus) {
      return res.status(400).json(error);
    }

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
const changeNairaRate = async (req, res) => {
  try {
    const { rate } = req.body;
    //validate input
    const validate = {
      amount: rate,
    };
    const { error, errorStatus } = validateAmount(validate);
    // check validation
    if (errorStatus) {
      return res.status(400).json(error);
    }

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
const approvePendingOrder = async (req, res) => {
  try {
    const { user } = req.body;
    const userPendingOrder = await Order.findUserPending(user);
    // if no pending order found
    if (!userPendingOrder) {
      return res.json({
        status: "fail",
        msg: "no pending orders for this user",
      });
    }
    //validate payment
    const verifytransaction = await flw.Transaction.verify({
      id: userPendingOrder.paymentId,
    });
    if (verifytransaction.status == "success") {
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
const declinePendingOrder = async (req, res) => {
  try {
    const { user } = req.body;
    const userPendingOrder = await Order.findUserPending(user);
    // if no pending order found
    if (!userPendingOrder) {
      return res.json({
        status: "fail",
        msg: "no pending orders for this user",
      });
    }

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
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const foundUser = await Admin.findOneByEmail(email);
    console.log("found admin:", foundUser);
    if (foundUser) {
      const validatePassword = await foundUser.PasswordValid(password);
      console.log("isPasswordValid:", validatePassword);
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
const testToken = (req, res) => {
  return res.json({
    msg: "testing",
    foundUser: req.user,
  });
};
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
