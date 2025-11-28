// server/src/data/products.js
const Category = require("../models/category.model");

const rawProducts = [
  {
    name: "Apple iPhone 15",
    description: "Latest iPhone with A16 Bionic chip and advanced camera system.",
    price: 79999,
    image:
      "https://images.unsplash.com/photo-1695048051370-59a1ce5e5f67?auto=format&fit=crop&w=800&q=80",
    brand: "Apple",
    category: "Smartphones",
    countInStock: 10,
  },
  {
    name: "Samsung Galaxy S24",
    description: "Flagship Android phone with stunning display and great performance.",
    price: 72999,
    image:
      "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
    brand: "Samsung",
    category: "Smartphones",
    countInStock: 15,
  },
  {
    name: "Sony WH-1000XM5 Headphones",
    description: "Industry-leading noise cancelling over-ear headphones.",
    price: 24999,
    image:
      "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80",
    brand: "Sony",
    category: "Headphones",
    countInStock: 20,
  },
  {
    name: "Dell XPS 13 Laptop",
    description: "Ultrabook with Intel i7, 16GB RAM, 512GB SSD.",
    price: 109999,
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    brand: "Dell",
    category: "Laptops",
    countInStock: 5,
  },
  {
    name: "Apple Watch Series 9",
    description: "Smartwatch with fitness tracking and notifications.",
    price: 39999,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    brand: "Apple",
    category: "Wearables",
    countInStock: 12,
  },
  {
    name: "Logitech MX Master 3 Mouse",
    description: "Ergonomic wireless mouse for productivity.",
    price: 8999,
    image:
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=80",
    brand: "Logitech",
    category: "Accessories",
    countInStock: 25,
  },
];

/**
 * Convert category names into category ObjectIds
 */
async function mapCategories() {
  const finalProducts = [];

  for (const p of rawProducts) {
    const categoryDoc = await Category.findOne({
      name: p.category,
    });

    if (!categoryDoc) {
      throw new Error(`Category not found in DB: ${p.category}`);
    }

    finalProducts.push({
      ...p,
      category: categoryDoc._id, // 🟢 assign ObjectId
    });
  }

  return finalProducts;
}

module.exports = { rawProducts, mapCategories };
