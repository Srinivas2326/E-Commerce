const express = require("express");
const { protect } = require("../middleware/auth.middleware");
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/user.controller");

const router = express.Router();

// /api/users/wishlist
router.get("/wishlist", protect, getWishlist);
router.post("/wishlist/:productId", protect, addToWishlist);
router.delete("/wishlist/:productId", protect, removeFromWishlist);

module.exports = router;
