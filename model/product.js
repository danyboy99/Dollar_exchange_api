const mongoose = require("mongoose");

const { Schema } = mongoose;

const productSchema = new Schema(
  {
    account: {
      type: String,
    },
    availableDollarBalance: {
      type: Number,
    },
    lockedDollarBalance: {
      type: Number,
    },
    nairaRate: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const product = mongoose.model("product", productSchema);

module.exports = product;
