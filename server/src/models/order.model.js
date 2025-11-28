const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    // store the product name at the time of order
    name: {
      type: String,
      required: true,
    },
    // optional image URL for nicer display in "My Orders"
    image: {
      type: String,
    },
    qty: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [orderItemSchema],
    totalPrice: {
      type: Number,
      required: true,
    },

    // payment status you already had
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,

    shippingAddress: {
      address: String,
      city: String,
      postalCode: String,
      country: String,
    },

    // optional overall order status
    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
