import React from "react";
import { Link } from "react-router-dom";
import { useCartContext } from "../context/CartContext";
import { useWishlistContext } from "../context/WishlistContext";

const ProductCard = ({ product }) => {
  const { addToCart } = useCartContext();
  const { isInWishlist, toggleWishlist } = useWishlistContext();

  const handleAdd = () => {
    addToCart(product);
  };

  const inWishlist = isInWishlist(product._id);

  return (
    <div
      style={{
        border: "1px solid #1f2937",
        borderRadius: "8px",
        padding: "0.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
      }}
    >
      <Link to={`/product/${product._id}`}>
        <img
          src={product.image || "https://via.placeholder.com/300"}
          alt={product.name}
          style={{
            width: "100%",
            height: "180px",
            objectFit: "cover",
            borderRadius: "6px",
          }}
        />
      </Link>

      <div style={{ flexGrow: 1 }}>
        <Link
          to={`/product/${product._id}`}
          style={{
            fontWeight: "bold",
            display: "block",
            marginBottom: "0.25rem",
          }}
        >
          {product.name}
        </Link>
        <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
          {product.brand} · {product.category}
        </p>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "0.25rem",
        }}
      >
        <span style={{ fontWeight: "bold" }}>₹{product.price}</span>

        <button
          onClick={() => toggleWishlist(product)}
          style={{
            border: "none",
            background: "transparent",
            fontSize: "1.35rem",
            cursor: "pointer",
            marginRight: "0.5rem",
          }}
          title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
        >
          {inWishlist ? "❤️" : "🤍"}
        </button>

        <button
          onClick={handleAdd}
          disabled={!product.countInStock}
          style={{
            padding: "0.25rem 0.75rem",
            borderRadius: "4px",
            border: "none",
            cursor: product.countInStock ? "pointer" : "not-allowed",
            opacity: product.countInStock ? 1 : 0.5,
          }}
        >
          {product.countInStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
