const Product = require("../models/product.model");
const { mapCategories } = require("../data/products"); // <-- updated import

// @desc    Get all products (optionally filter by category / search)
// @route   GET /api/products?category=<categoryId>&search=<text>
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;

    const filter = {};

    // Filter by category id
    if (category) {
      filter.category = category;
    }

    // Optional: search by name (case-insensitive)
    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const products = await Product.find(filter)
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    return res.json(products);
  } catch (error) {
    console.error("Get products error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "category",
      "name slug"
    );

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    return res.json(product);
  } catch (error) {
    console.error("Get product by id error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Admin
exports.createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    return res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Admin
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    return res.json(product);
  } catch (error) {
    console.error("Update product error:", error);
    return res.status(400).json({ message: error.message });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    return res.json({ message: "Product removed" });
  } catch (error) {
    console.error("Delete product error:", error);
    return res.status(500).json({ message: error.message });
  }
};

// @desc    Seed sample products (dev only)
// @route   GET /api/products/seed
// @access  Public (you can change to Admin later)
exports.seedProducts = async (req, res) => {
  try {
    // Clear existing products
    await Product.deleteMany({});

    // Use helper to map category names -> Category ObjectIds
    const productsData = await mapCategories();

    // Insert sample products
    const createdProducts = await Product.insertMany(productsData);

    return res.status(201).json({
      message: "Products seeded successfully",
      count: createdProducts.length,
    });
  } catch (error) {
    console.error("Seed products error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Failed to seed products" });
  }
};
