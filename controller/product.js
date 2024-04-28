const Product = require("../services/product.js");
const initializeProduct = async (req, res) => {
  try {
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

module.exports = {
  initializeProduct,
};
