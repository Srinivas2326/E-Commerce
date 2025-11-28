import React from "react";
import { useWishlistContext } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard"; 

const Wishlist = () => {
  const { items, loading } = useWishlistContext();

  if (loading) {
    return <main style={{ padding: "1rem" }}>Loading wishlist...</main>;
  }

  return (
    <main style={{ padding: "1rem" }}>
      <h1>My Wishlist</h1>
      {items.length === 0 ? (
        <p style={{ marginTop: "0.5rem" }}>You have no items in wishlist.</p>
      ) : (
        <div
          style={{
            marginTop: "1rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
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
