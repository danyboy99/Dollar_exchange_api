const Product = require("../model/product.js");

const productInit = async () => {
  try {
    const product = await Product.create({
      account: "main",
      availableDollarBalance: 0,
      lockedDollarBalance: 0,
      nairaRate: 1300,
    });
    return product;
  } catch (err) {
    const error = {
      status: "error",
      msg: err.message,
      error: err,
    };
    return error;
  }
};
const index = async () => {
  try {
    const product = await Product.findOne({ account: "main" });
    return product;
  } catch (err) {
    const error = {
      status: "error",
      msg: err.message,
      error: err,
    };
    return error;
  }
};
const nairaRate = async () => {
  try {
    const product = await Product.findOne({ account: "main" });
    return product.nairaRate;
  } catch (err) {
    const error = {
      status: "error",
      msg: err.message,
      error: err,
    };
    return error;
  }
};
const availableDollarBalance = async () => {
  try {
    const product = await Product.findOne({ account: "main" });
    return product.availableDollarBalance;
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
  productInit,
  index,
  nairaRate,
  availableDollarBalance,
};
