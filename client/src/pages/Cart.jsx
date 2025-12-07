import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCartContext } from "../context/CartContext";

const Cart = () => {
  const { cartItems, removeFromCart, updateQty, totalPrice } = useCartContext();
  const navigate = useNavigate();

  const goToCheckout = () => {
    if (cartItems.length === 0) return;
    navigate("/checkout");
  };

  const btnStyle = (disabled) => ({
    background: disabled ? "#3f3f46" : "var(--primary)",
    border: "none",
    borderRadius: "6px",
    width: "28px",
    height: "28px",
    color: "#fff",
    cursor: disabled ? "not-allowed" : "pointer",
    fontSize: "18px",
    fontWeight: "bold",
    opacity: disabled ? 0.6 : 1,
  });

  return (
    <main className="container page">
      <h1>Your Cart</h1>

      {cartItems.length === 0 ? (
        <p style={{ marginTop: "1rem" }}>
          Cart is empty. <Link to="/">Go shopping</Link>
        </p>
      ) : (
        <>
          <ul style={{ listStyle: "none", marginTop: "1rem", padding: 0 }}>
            {cartItems.map((item) => {
              const stock = item.product.countInStock;
              const disablePlus = item.qty >= stock;
              const disableMinus = item.qty <= 1;

              return (
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
                  {/* Product Info */}
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      style={{ width: "60px", borderRadius: "6px" }}
                    />

                    <div>
                      <p style={{ fontSize: "1rem", fontWeight: 500 }}>{item.product.name}</p>
                      <p style={{ fontSize: "0.8rem", color: "#9ca3af" }}>
                        In Stock: {stock}
                      </p>

                      {/* Qty Control */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          marginTop: "6px",
                        }}
                      >
                        <button
                          onClick={() =>
                            !disableMinus && updateQty(item.product._id, item.qty - 1)
                          }
                          disabled={disableMinus}
                          style={btnStyle(disableMinus)}
                        >
                          -
                        </button>

                        <span style={{ fontSize: "16px", width: "24px", textAlign: "center" }}>
                          {item.qty}
                        </span>

                        <button
                          onClick={() => {
                            if (disablePlus) {
                              alert(`Only ${stock} left in stock`);
                              return;
                            }
                            updateQty(item.product._id, item.qty + 1);
                          }}
                          disabled={disablePlus}
                          style={btnStyle(disablePlus)}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "1rem", fontWeight: 600 }}>
                      ₹{item.product.price * item.qty}
                    </p>

                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      style={{
                        marginTop: "0.5rem",
                        padding: "0.25rem 0.75rem",
                        borderRadius: "6px",
                        border: "1px solid #ef4444",
                        background: "transparent",
                        color: "#ef4444",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Total Price + Checkout */}
          <div style={{ marginTop: "1.5rem", textAlign: "right" }}>
            <h2 style={{ fontWeight: "bold" }}>Total: ₹{totalPrice}</h2>
            <button
              onClick={goToCheckout}
              style={{
                marginTop: "0.75rem",
                padding: "0.5rem 1.5rem",
                borderRadius: "6px",
                background: "var(--primary)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
              }}
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
