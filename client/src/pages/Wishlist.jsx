import React from "react";
import { useWishlistContext } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";

const Wishlist = () => {
  const { items, loading } = useWishlistContext();

  if (loading) {
    return (
      <main style={{ padding: "2rem", textAlign: "center" }}>
        <h2>Loading your wishlist...</h2>
      </main>
    );
  }

  return (
    <main style={{ padding: "1.5rem" }}>
      <h2 style={{ marginBottom: "1.3rem" }}>My Wishlist</h2>

      {items.length === 0 ? (
        <p style={{ fontSize: "1rem", opacity: 0.8 }}>
          Your wishlist is empty. Start adding your favorite products ❤️
        </p>
      ) : (
        <div
          style={{
            marginTop: "1rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {items.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
};

export default Wishlist;
