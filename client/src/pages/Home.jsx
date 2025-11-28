import React, { useEffect, useState } from "react";
import { fetchProducts } from "../services/api";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const { data } = await fetchProducts();
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) {
    return <p style={{ padding: "1rem" }}>Loading products...</p>;
  }

  if (error) {
    return (
      <p style={{ padding: "1rem", color: "tomato" }}>
        {error}
      </p>
    );
  }

  return (
    <main style={{ padding: "1rem" }}>
      <h1>Shop Products</h1>
      {products.length === 0 ? (
        <p style={{ marginTop: "1rem" }}>No products available.</p>
      ) : (
        <div
          style={{
            marginTop: "1rem",
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Home;
