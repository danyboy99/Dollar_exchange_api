// Import required models
const Order = require("../model/orders.js");
const Product = require("../model/product.js");

// Create new order
const create = async (
  user,
  amountInDollar,
  amountInNaira,
  paymentId,
  paymentFlw_ref,
  paymentTx_ref
) => {
  try {
    const order = await Order.create({
      user,
      amountInDollar,
      amountInNaira,
      paymentId,
      paymentFlw_ref,
      paymentTx_ref,
    });
    return order;
  } catch (err) {
    const error = {
      status: "error",
      msg: err.message,
      error: err,
    };
    return error;
  }
};

// Find order by user
const findByUser = async (user) => {
  try {
    const userOrder = await Order.findOne({ user: user });
    return userOrder;
  } catch (err) {
    const error = {
      status: "error",
      msg: err.message,
      error: err,
    };
    return error;
  }
};

// Find user's pending order
const findUserPending = async (user) => {
  try {
    const userOrder = await Order.findOne({
      user: user,
      orderStatus: "pending",
    });
    return userOrder;
  } catch (err) {
    const error = {
      status: "error",
      msg: err.message,
      error: err,
    };
    return error;
  }
};

// Find all pending orders
const findPendingOrders = async () => {
  try {
    const userOrders = await Order.find({
      orderStatus: "pending",
    });
    return userOrders;
  } catch (err) {
    const error = {
      status: "error",
      msg: err.message,
      error: err,
    };
    return error;
  }
};

// Delete user's unpaid order
const deleteOrder = async (user) => {
  try {
    await Order.findOneAndDelete({ user: user, paymentRecieve: false }).then(
      (data) => {
        res.json({
          status: "success",
          msg: "order deleted successfuly",
        });
      }
    );
  } catch (err) {
    const error = {
      status: "error",
      msg: err.message,
      error: err,
    };
    return error;
  }
};

// Find all orders
const findAllOrders = async () => {
  try {
    const orders = await Order.find();
    return orders;
  } catch (err) {
    const error = {
      status: "error",
      msg: err.message,
      error: err,
    };
    return error;
  }
};

// Update order status (pending, success, failed)
const updateOrderStatus = async (user, update) => {
  try {
    const userPendingOrder = await Order.findOne({
      user: user,
      orderStatus: "pending",
    });
    userPendingOrder.orderStatus = update;
    await userPendingOrder.save();
    return userPendingOrder;
  } catch (err) {
    const error = {
      status: "error",
      msg: err.message,
      error: err,
    };
    return error;
  }
};

// Update payment received status
const updatePaymentStatus = async (user, update) => {
  try {
    const userPendingOrder = await Order.findOne({
      user: user,
      orderStatus: "pending",
    });
    userPendingOrder.paymentRecieve = update;
    await userPendingOrder.save();
    return userPendingOrder;
  } catch (err) {
    const error = {
      status: "error",
      msg: err.message,
      error: err,
    };
    return error;
  }
};

// Export all order service functions
module.exports = {
  create,
  findByUser,
  findUserPending,
  findPendingOrders,
  deleteOrder,
  findAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
};
