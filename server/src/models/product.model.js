// server/src/models/product.model.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },

    // 👇 IMPORTANT: link to Category
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    countInStock: { type: Number, default: 0 },
    // ...any other fields you already have
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
