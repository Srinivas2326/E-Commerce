import React from "react";
import { Link } from "react-router-dom";
import { useCartContext } from "../context/CartContext";
import { useWishlistContext } from "../context/WishlistContext";

const ProductCard = ({ product }) => {
  const { cartItems, addToCart, updateQty } = useCartContext();
  const { isInWishlist, toggleWishlist } = useWishlistContext();

  const inWishlist = isInWishlist(product._id);

  // Check if item is already in cart
  const itemInCart = cartItems.find(
    (item) => (item.product._id || item.product.id) === product._id
  );

  const qtyBtnStyle = {
    background: "var(--primary-color)",
    border: "none",
    borderRadius: "6px",
    width: "28px",
    height: "28px",
    color: "#fff",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
  };

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
          {product.brand}
          {product.category?.name ? ` · ${product.category.name}` : ""}
        </p>
      </div>

      {/* Price + Wishlist + Cart Controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "0.25rem",
        }}
      >
        <span style={{ fontWeight: "bold" }}>₹{product.price}</span>

        {/* Wishlist Button */}
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

        {/* Cart Quantity Controls */}
        {itemInCart ? (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              onClick={() =>
                updateQty(product._id, itemInCart.qty - 1)
              }
              style={qtyBtnStyle}
            >
              -
            </button>

            <span
              style={{
                fontSize: "16px",
                width: "22px",
                textAlign: "center",
              }}
            >
              {itemInCart.qty}
            </span>

            <button
              onClick={() =>
                updateQty(product._id, itemInCart.qty + 1)
              }
              style={qtyBtnStyle}
              disabled={itemInCart.qty >= product.countInStock}
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={() => addToCart(product)}
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
        )}
      </div>
    </div>
  );
};

export default ProductCard;
