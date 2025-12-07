const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  seedProducts,
  createReview, // ⭐ Added review controller
} = require("../controllers/product.controller");

const { protect, admin } = require("../middleware/auth.middleware");

const router = express.Router();

// Seed products (dev only)
router.get("/seed", seedProducts);

// Public product routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// ⭐ NEW: Review route (only logged users)
router.post("/:id/reviews", protect, createReview);

// Admin-only product management
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
