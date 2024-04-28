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
  if (adminAlreadyExist.email) {
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
  res.json({
    status: "success",
    msg: "Admin created",
    userToken: "Bearer " + signtoken,
  });
};
const login = (req, res) => {
  const token = Admin.signToken(req.user);
  res.json({
    status: "success",
    msg: "Login successful!!",
    token: "Bearer " + token,
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
    const { error, isValid } = validateAmount(req.body);
    // check validation
    if (!isValid) {
      return res.status(400).json(error);
    }
    let product = await Product.index();
    product.availableDollarBalance += amount;
    product.save().then((data) => {
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
const removeFromAvaliableBalance = async (req, res) => {
  try {
    const { amount } = req.body;
    const { error, isValid } = validateAmount(req.body);
    // check validation
    if (!isValid) {
      return res.status(400).json(error);
    }
    let product = await Product.index();
    product.availableDollarBalance -= amount;
    product.save().then((data) => {
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
    const validate = {
      amount: rate,
    };
    const { error, isValid } = validateAmount(validate);
    // check validation
    if (!isValid) {
      return res.status(400).json(error);
    }
    let product = await Product.index();
    product.nairaRate = rate;
    product.save().then((data) => {
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
    const product = await Product.index();
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
      userPendingOrder.orderStatus = "success";
      product.lockedDollarBalance -= userPendingOrder.amountInDollar;
      await product.save();
      userPendingOrder.save().then((data) => {
        res.json({
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
    const product = await Product.index();
    // if no pending order found
    if (!userPendingOrder) {
      return res.json({
        status: "fail",
        msg: "no pending orders for this user",
      });
    }
    userPendingOrder.orderStatus = "failed";
    product.lockedDollarBalance -= userPendingOrder.amountInDollar;
    product.availableDollarBalance += userPendingOrder.amountInDollar;
    await product.save();
    userPendingOrder.save().then((data) => {
      res.json({
        status: "success",
        msg: "payment approved successfuly !",
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
};
