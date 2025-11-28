import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCartContext } from "../context/CartContext";

const Cart = () => {
  const { cartItems, removeFromCart, totalPrice } = useCartContext();
  const navigate = useNavigate();

  const goToCheckout = () => {
    if (cartItems.length === 0) return;
    navigate("/checkout");
  };

  return (
    <main style={{ padding: "1rem" }}>
      <h1>Your Cart</h1>

      {cartItems.length === 0 ? (
        <p style={{ marginTop: "1rem" }}>
          Cart is empty. <Link to="/">Go shopping</Link>
        </p>
      ) : (
        <>
          <ul style={{ listStyle: "none", marginTop: "1rem", padding: 0 }}>
            {cartItems.map((item) => (
              <li
                key={item.product._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem 0",
                  borderBottom: "1px solid #1f2937",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <img
                    src={item.product.image || "https://via.placeholder.com/60"}
                    alt={item.product.name}
                    style={{ width: "60px", borderRadius: "4px" }}
                  />
                  <div>
                    <p>{item.product.name}</p>
                    <p style={{ fontSize: "0.9rem", opacity: 0.8 }}>
                      Qty: {item.qty} × ₹{item.product.price}
                    </p>
                  </div>
                </div>

                <div>
                  <p>₹{item.product.price * item.qty}</p>
                  <button
                    style={{
                      marginTop: "0.5rem",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "4px",
                      border: "1px solid #ef4444",
                      background: "transparent",
                      color: "#ef4444",
                      cursor: "pointer",
                    }}
                    onClick={() => removeFromCart(item.product._id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: "1.5rem", textAlign: "right" }}>
            <h2>Total: ₹{totalPrice}</h2>
            <button
              style={{
                marginTop: "0.75rem",
                padding: "0.5rem 1.5rem",
                borderRadius: "4px",
                border: "none",
                cursor: "pointer",
              }}
              onClick={goToCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </main>
  );
};

export default Cart;
