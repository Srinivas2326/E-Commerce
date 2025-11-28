const User = require("../models/user.model");
const Product = require("../models/product.model");

// GET /api/users/wishlist  (logged-in user's wishlist)
exports.getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.json(user.wishlist || []);
  } catch (err) {
    res.status(500).json({ message: "Failed to load wishlist" });
  }
};

// POST /api/users/wishlist/:productId  (add)
exports.addToWishlist = async (req, res) => {
  try {
    const productId = req.params.productId;

    // ensure product exists (optional but nice)
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const user = await User.findById(req.user._id);

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    const populated = await user.populate("wishlist");
    res.json(populated.wishlist);
  } catch (err) {
    res.status(500).json({ message: "Failed to add to wishlist" });
  }
};

// DELETE /api/users/wishlist/:productId  (remove)
exports.removeFromWishlist = async (req, res) => {
  try {
    const productId = req.params.productId;

    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== productId.toString()
    );
    await user.save();

    const populated = await user.populate("wishlist");
    res.json(populated.wishlist);
  } catch (err) {
    res.status(500).json({ message: "Failed to remove from wishlist" });
  }
};
