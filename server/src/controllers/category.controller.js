// server/src/controllers/category.controller.js
const Category = require("../models/category.model");

// GET /api/categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    console.error("Get categories error:", err);
    res.status(500).json({ message: "Failed to load categories" });
  }
};
