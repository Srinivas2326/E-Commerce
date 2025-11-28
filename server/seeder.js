// server/seeder.js
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const Product = require("./src/models/product.model"); // adjust path if different
const productsData = require("./data/products.json");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log("MongoDB connected for seeding");
  } catch (err) {
    console.error("Mongo connect error:", err);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();
    // OPTIONAL: clear existing products to avoid duplicates
    await Product.deleteMany();
    console.log("Existing products removed");

    const created = await Product.insertMany(productsData);
    console.log(`Inserted ${created.length} products`);
    process.exit();
  } catch (err) {
    console.error("Seeding error:", err);
    process.exit(1);
  }
};

if (require.main === module) {
  importData();
}
