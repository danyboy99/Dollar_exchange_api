// Import mongoose
const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define order schema for dollar exchange orders
const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user" }, // Reference to user who placed order
    amountInDollar: {
      type: Number,
      required: true, // Dollar amount being purchased
    },
    amountInNaira: {
      type: Number,
      required: true, // Naira amount to be paid
    },
    orderStatus: {
      type: String,
      default: "pending", // Order status (pending, completed, failed)
    },
    paymentRecieve: {
      type: Boolean,
      default: false, // Whether payment has been received
    },
    paymentId: { type: String, required: true }, // Payment gateway ID
    paymentFlw_ref: { type: String, required: true }, // Flutterwave reference
    paymentTx_ref: { type: String, required: true }, // Transaction reference
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt
  }
);

// Create and export order model
const order = mongoose.model("order ", orderSchema);

module.exports = order;
