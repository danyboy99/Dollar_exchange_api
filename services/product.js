// Import product model
const Product = require("../model/product.js");

// Initialize product with default values
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

// Get main product information
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

// Get current Naira exchange rate
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

// Get available dollar balance
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

// Update the Naira exchange rate
const changeNairaRate = async (rate) => {
  try {
    const product = await Product.findOne({ account: "main" });
    product.nairaRate = Number(rate);
    await product.save();
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

// Update locked dollar balance (add or remove)
const updateLockBalance = async (amount, update) => {
  try {
    if (update === "add") {
      const product = await Product.findOne({ account: "main" });
      product.lockedDollarBalance += Number(amount);
      await product.save();
      return product;
    }
    if (update === "remove") {
      const product = await Product.findOne({ account: "main" });
      product.lockedDollarBalance -= Number(amount);
      await product.save();
      return product;
    }
  } catch (err) {
    const error = {
      status: "error",
      msg: err.message,
      error: err,
    };
    return error;
  }
};

// Update available dollar balance (add or remove)
const updateDollarBalance = async (amount, update) => {
  try {
    if (update === "add") {
      const product = await Product.findOne({ account: "main" });
      product.availableDollarBalance += Number(amount);
      await product.save();
      return product;
    }
    if (update === "remove") {
      const product = await Product.findOne({ account: "main" });
      product.availableDollarBalance -= Number(amount);
      await product.save();
      return product;
    }
  } catch (err) {
    const error = {
      status: "error",
      msg: err.message,
      error: err,
    };
    return error;
  }
};

// Export all product service functions
module.exports = {
  productInit,
  index,
  nairaRate,
  availableDollarBalance,
  changeNairaRate,
  updateLockBalance,
  updateDollarBalance,
};
