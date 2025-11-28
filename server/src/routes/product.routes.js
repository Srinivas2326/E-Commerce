const express = require("express");
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  seedProducts,
} = require("../controllers/product.controller");
const { protect, admin } = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/seed", seedProducts);

router.get("/", getProducts);
router.get("/:id", getProductById);

// Admin only
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;
