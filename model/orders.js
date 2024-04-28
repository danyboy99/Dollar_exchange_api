const mongoose = require("mongoose");

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "user" },
    amountInDollar: {
      type: Number,
      required: true,
    },
    amountInNaira: {
      type: Number,
      required: true,
    },
    orderStatus: {
      type: String,
      default: "pending",
    },
    paymentRecieve: {
      type: Boolean,
      default: false,
    },
    paymentId: { type: String, required: true },
    paymentFlw_ref: { type: String, required: true },
    paymentTx_ref: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const order = mongoose.model("order ", orderSchema);

module.exports = order;
