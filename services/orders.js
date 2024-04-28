const Order = require("../model/orders.js");
const Product = require("../model/product.js");

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
module.exports = {
  create,
  findByUser,
  findUserPending,
  findPendingOrders,
  deleteOrder,
  findAllOrders,
};
