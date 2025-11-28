import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import API from "../api";
import { useCartContext } from "../context/CartContext";
import { useAuthContext } from "../context/AuthContext";
import PaymentForm from "../components/PaymentForm";

const CHECKOUT_KEY = "ecom-shipping";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCartContext();
  const { user } = useAuthContext();
  const token = user?.token || user?.accessToken || null;

  const [shipping, setShipping] = useState(() => {
    const stored = localStorage.getItem(CHECKOUT_KEY);
    return stored
      ? JSON.parse(stored)
      : { address: "", city: "", postalCode: "", country: "" };
  });

  const [placing, setPlacing] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");

  const stripePromise = useMemo(
    () => loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY),
    []
  );

  useEffect(() => {
    localStorage.setItem(CHECKOUT_KEY, JSON.stringify(shipping));
  }, [shipping]);

  const handleChange = (e) => {
    setShipping((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("You must be logged in to place an order.");
      return;
    }

    if (!cartItems.length) {
      setError("Your cart is empty.");
      return;
    }

    setPlacing(true);

    try {
      // Build order items payload
      const orderItemsPayload = cartItems.map((i) => ({
        product: i.product._id,
        name: i.product.name,
        image: i.product.image,
        qty: i.qty,
        price: i.product.price,
      }));

      const payload = {
        orderItems: orderItemsPayload,
        shippingAddress: shipping,
        totalPrice,
      };

      // 1. Create order
      const orderRes = await API.post("/orders", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const createdOrder = orderRes.data;
      setOrderId(createdOrder._id);

      // 2. Create PaymentIntent in paise
      const amountInSmallestUnit = Math.round(
        (createdOrder.totalPrice || totalPrice) * 100
      );

      const paymentRes = await API.post(
        "/payments/create-payment-intent",
        {
          amount: amountInSmallestUnit,
          currency: "inr",
          orderId: createdOrder._id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const secret =
        paymentRes.data?.clientSecret || paymentRes.data?.client_secret;
      if (!secret) throw new Error("No client secret returned from server");

      setClientSecret(secret);
    } catch (err) {
      console.error("Checkout error:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to place order"
      );
    } finally {
      setPlacing(false);
    }
  };

 const onPaymentSuccess = () => {
  // Order will be marked as paid by Stripe webhook on the backend
  clearCart();
  localStorage.removeItem(CHECKOUT_KEY);

  // 👇 send a one-time success message to My Orders page
  navigate("/my-orders", {
    state: { successMessage: "Order placed & payment successful ✅" },
  });
};


  // If we already have a clientSecret, show the payment screen
  if (clientSecret && orderId) {
    return (
      <main style={{ padding: "1rem", maxWidth: 720, margin: "0 auto" }}>
        <h1>Payment</h1>
        <p style={{ color: "var(--text-soft)" }}>
          Paying for order <strong>{orderId}</strong> — Total: ₹{totalPrice}
        </p>

        {error && (
          <p style={{ color: "tomato", marginTop: "0.5rem" }}>{error}</p>
        )}

        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <PaymentForm
            clientSecret={clientSecret}
            onSuccess={onPaymentSuccess}
            onFail={(msg) => setError(msg)}
          />
        </Elements>
      </main>
    );
  }

  // Initial checkout form (shipping + summary)
  return (
    <main style={{ padding: "1rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1>Checkout</h1>

      <section
        style={{
          marginTop: "1rem",
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "1.5rem",
        }}
      >
        {/* Shipping form */}
        <form onSubmit={placeOrder}>
          <h2>Shipping Address</h2>

          {error && (
            <p style={{ color: "tomato", marginTop: "0.5rem" }}>{error}</p>
          )}

          <div
            style={{
              marginTop: "1rem",
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
            }}
          >
            <input
              name="address"
              placeholder="Address"
              value={shipping.address}
              onChange={handleChange}
              required
            />
            <input
              name="city"
              placeholder="City"
              value={shipping.city}
              onChange={handleChange}
              required
            />
            <input
              name="postalCode"
              placeholder="Postal Code"
              value={shipping.postalCode}
              onChange={handleChange}
              required
            />
            <input
              name="country"
              placeholder="Country"
              value={shipping.country}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={placing}
            style={{
              marginTop: "1rem",
              padding: "0.6rem 1.25rem",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
            }}
            className="btn btn-primary"
          >
            {placing
              ? "Placing order..."
              : `Place order & pay ₹${totalPrice}`}
          </button>
        </form>

        {/* Order summary */}
        <aside>
          <h2>Order Summary</h2>
          <ul
            style={{
              listStyle: "none",
              marginTop: "0.75rem",
              padding: 0,
            }}
          >
            {cartItems.map((item) => (
              <li
                key={item.product._id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "0.5rem",
                }}
              >
                <span>
                  {item.product.name} × {item.qty}
                </span>
                <span>₹{item.product.price * item.qty}</span>
              </li>
            ))}
          </ul>
          <hr style={{ margin: "0.75rem 0" }} />
          <p
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "bold",
            }}
          >
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </p>
        </aside>
      </section>
    </main>
  );
}
