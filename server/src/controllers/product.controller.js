const Product = require("../models/product.model");
const { mapCategories } = require("../data/products");

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: "i" };

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

// @desc    Create product review
// @route   POST /api/products/:id/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed)
      return res.status(400).json({ message: "Product already reviewed" });

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    console.error("Create review error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Seed products
// @route   GET /api/products/seed
// @access  Public (dev only)
exports.seedProducts = async (req, res) => {
  try {
    await Product.deleteMany({});

    const productsData = await mapCategories();
    const createdProducts = await Product.insertMany(productsData);

    return res.status(201).json({
      message: "Products seeded successfully",
      count: createdProducts.length,
    });
  } catch (error) {
    console.error("Seed products error:", error);
    return res.status(500).json({ message: error.message });
  }
};
