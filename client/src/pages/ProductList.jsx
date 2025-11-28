import React, { useEffect, useState } from "react";
import API from "../api";
import ProductCard from "../components/ProductCard";
import CategoryFilter from "../components/CategoryFilter";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");

  const loadProducts = async () => {
    try {
      const params = new URLSearchParams();

      if (category) params.append("category", category);
      if (search) params.append("search", search);

      const { data } = await API.get(`/products?${params.toString()}`);
      setProducts(data);
    } catch (err) {
      console.error(err);
      setProducts([]);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [category]);

  const handleSearch = (e) => {
    e.preventDefault();
    loadProducts();
  };

  return (
    <div className="container page">
      <h2 className="section-title">Shop Products</h2>

      {/* Search + Category filter */}
      <div style={{ marginBottom: "1rem" }}>
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>

        <CategoryFilter value={category} onChange={setCategory} />
      </div>

      <div className="products-grid">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>

      {products.length === 0 && (
        <p style={{ color: "tomato", marginTop: "1rem" }}>
          No products found for this filter
        </p>
      )}
    </div>
  );
}
