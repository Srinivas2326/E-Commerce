const express = require("express");
const Review = require("../models/review.model");
const Product = require("../models/product.model");
const { protect, admin } = require("../middleware/auth.middleware");
const router = express.Router();

router.post("/", protect, async (req, res) => {
  const { product: productId, rating, comment } = req.body;
  if (!productId || !rating) return res.status(400).json({ message: "Missing product or rating" });

  const exists = await Review.findOne({ product: productId, user: req.user.id });
  if (exists) return res.status(400).json({ message: "You already reviewed this product" });

  const review = await Review.create({ product: productId, user: req.user.id, rating, comment });

  // Recalculate average rating
  const stats = await Review.aggregate([
    { $match: { product: review.product } },
    { $group: { _id: "$product", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } }
  ]);
  const { avgRating = rating, count = 1 } = stats[0] || {};
  await Product.findByIdAndUpdate(review.product, { rating: avgRating, numReviews: count });

  res.status(201).json(review);
});

router.get("/product/:productId", async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId }).populate("user", "username");
  res.json(reviews);
});

router.delete("/:id", protect, admin, async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) return res.status(404).json({ message: "Not found" });
  await review.remove();

  // update product stats
  const stats = await Review.aggregate([
    { $match: { product: review.product } },
    { $group: { _id: "$product", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } }
  ]);
  const { avgRating = 0, count = 0 } = stats[0] || {};
  await Product.findByIdAndUpdate(review.product, { rating: avgRating, numReviews: count });

  res.json({ message: "Deleted" });
});

module.exports = router;
