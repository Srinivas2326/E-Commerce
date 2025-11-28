// server/src/routes/category.routes.js
const express = require("express");
const Category = require("../models/category.model");
const { protect, admin } = require("../middleware/auth.middleware");
const categoriesData = require("../data/categories");

const router = express.Router();

/**
 * @route   GET /api/categories
 * @desc    List all categories (public)
 */
router.get("/", async (req, res) => {
  try {
    const cats = await Category.find().sort({ name: 1 });
    res.json(cats);
  } catch (err) {
    console.error("Get categories error:", err);
    res.status(500).json({ message: "Failed to load categories" });
  }
});

/**
 * @route   GET /api/categories/seed
 * @desc    Seed sample categories (dev only)
 * @access  Public for now (can be restricted to admin later)
 */
router.get("/seed", async (req, res) => {
  try {
    await Category.deleteMany({});
    const created = await Category.insertMany(categoriesData);

    res.json({
      message: "Categories seeded successfully",
      count: created.length,
      categories: created,
    });
  } catch (err) {
    console.error("Seed categories error:", err);
    res
      .status(500)
      .json({ message: err.message || "Failed to seed categories" });
  }
});

/**
 * @route   POST /api/categories
 * @desc    Create a new category
 * @access  Admin
 */
router.post("/", protect, admin, async (req, res) => {
  try {
    const { name, description = "" } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const slug = name.toLowerCase().trim().replace(/\s+/g, "-");

    const existing = await Category.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const cat = await Category.create({ name, description, slug });
    res.status(201).json(cat);
  } catch (err) {
    console.error("Create category error:", err);
    res.status(500).json({ message: "Failed to create category" });
  }
});

/**
 * @route   PUT /api/categories/:id
 * @desc    Update a category
 * @access  Admin
 */
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const updates = { ...req.body };

    // If name is changed, regenerate slug
    if (updates.name) {
      updates.slug = updates.name.toLowerCase().trim().replace(/\s+/g, "-");
    }

    const cat = await Category.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!cat) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(cat);
  } catch (err) {
    console.error("Update category error:", err);
    res.status(500).json({ message: "Failed to update category" });
  }
});

/**
 * @route   DELETE /api/categories/:id
 * @desc    Delete a category
 * @access  Admin
 */
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const cat = await Category.findByIdAndDelete(req.params.id);

    if (!cat) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted" });
  } catch (err) {
    console.error("Delete category error:", err);
    res.status(500).json({ message: "Failed to delete category" });
  }
});

module.exports = router;
