// Import product service
const Product = require("../services/product.js");

// Initialize product with default values
const initializeProduct = async (req, res) => {
  try {
    // Initialize product in database
    const product = await Product.productInit();

    res.json({
      status: "success",
      msg: "product initialize successfuly!!",
      productDetails: product,
    });
  } catch (err) {
    res.json({
      status: "error",
      msg: err.message,
      err: err,
    });
  }
};

// Export product controller functions
module.exports = {
  initializeProduct,
};
