import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import { useCartContext } from "../context/CartContext";
import { useWishlistContext } from "../context/WishlistContext";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuthContext();
  const { cartItems } = useCartContext();
  const { items: wishlistItems } = useWishlistContext();
  const navigate = useNavigate();

  const cartCount = cartItems.reduce((total, item) => total + item.qty, 0);
  const wishlistCount = wishlistItems.length || 0;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem",
        borderBottom: "1px solid #1f2937",
        background: "#0f172a",
      }}
    >

      <Link to="/" style={{ fontSize: "1.25rem", fontWeight: "bold" }}>
        🛒 E-Commerce
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {isAuthenticated && (
          <Link to="/wishlist">
            Wishlist ({wishlistCount})
          </Link>
        )}

        <Link to="/cart">Cart ({cartCount})</Link>

        {isAuthenticated && (
          <Link to="/my-orders">My Orders</Link>
        )}

        {isAuthenticated && user?.isAdmin && (
          <Link to="/admin/products">Admin</Link>
        )}

        {!isAuthenticated ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <span style={{ opacity: 0.85 }}>Hello, {user.name}</span>
            <button
              onClick={handleLogout}
              style={{
                border: "1px solid #ef4444",
                background: "transparent",
                color: "#ef4444",
                padding: "0.25rem 0.75rem",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
