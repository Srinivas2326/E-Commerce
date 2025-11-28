import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { fetchMyOrders } from "../services/api";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const location = useLocation();

  // Read success message from navigation state (coming from Checkout)
  useEffect(() => {
    if (location.state?.successMessage) {
      setSuccessMessage(location.state.successMessage);

      // Clear the state from the URL history so the message doesn't reappear on refresh
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [location.state]);

  // Load orders on mount
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const { data } = await fetchMyOrders();
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load orders");
      }
    };
    loadOrders();
  }, []);

  return (
    <main style={{ padding: "1rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1>My Orders</h1>

      {/* ✅ Success banner after successful checkout */}
      {successMessage && (
        <div
          style={{
            marginTop: "0.75rem",
            marginBottom: "0.75rem",
            padding: "0.75rem 1rem",
            borderRadius: 8,
            background: "#16a34a22",
            color: "#bbf7d0",
            border: "1px solid #16a34a",
          }}
        >
          {successMessage}
        </div>
      )}

      {/* Error message */}
      {error && (
        <p style={{ color: "tomato", marginTop: "0.5rem" }}>{error}</p>
      )}

      {/* Orders list */}
      {orders.length === 0 ? (
        <p style={{ marginTop: "1rem" }}>
          You haven't placed any orders yet.
        </p>
      ) : (
        orders.map((order) => (
          <section
            key={order._id}
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              border: "1px solid #ddd",
              borderRadius: "6px",
            }}
          >
            <p>
              <strong>Order ID:</strong> {order._id}
            </p>
            <p>
              <strong>Total:</strong> ₹{order.totalPrice}
            </p>
            <p>
              <strong>Status:</strong> {order.isPaid ? "Paid" : "Pending"}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.createdAt).toLocaleString()}
            </p>

            <h3 style={{ marginTop: "1rem" }}>Items:</h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {order.orderItems.map((item, index) => (
                <li
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  {/* Product Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    width="70"
                    height="70"
                    style={{
                      borderRadius: "6px",
                      objectFit: "cover",
                      border: "1px solid #ccc",
                    }}
                  />

                  {/* Product name + qty + price */}
                  <div>
                    <p style={{ margin: 0, fontWeight: "bold" }}>
                      {item.name}
                    </p>
                    <p style={{ margin: 0, opacity: 0.8 }}>
                      Qty: {item.qty} × ₹{item.price}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </main>
  );
};

export default MyOrders;
