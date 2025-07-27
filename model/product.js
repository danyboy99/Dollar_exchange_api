// Import mongoose
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define product schema for dollar exchange
const productSchema = new Schema(
  {
    account: {
      type: String, // Account identifier
    },
    availableDollarBalance: {
      type: Number, // Available dollar balance for exchange
    },
    lockedDollarBalance: {
      type: Number, // Locked dollar balance (pending transactions)
    },
    nairaRate: {
      type: Number, // Current exchange rate (Naira per Dollar)
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Create and export product model
const product = mongoose.model("product", productSchema);

module.exports = product;
