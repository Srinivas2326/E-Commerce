import React, { useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import API from "../api";
import { useAuthContext } from "../context/AuthContext";

export default function CheckoutForm({ orderId, amount }) {
  const stripe = useStripe();
  const elements = useElements();
  const { token } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    try {
      const { data } = await API.post("/payments/create-payment-intent", { amount, orderId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const clientSecret = data.clientSecret;
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) }
      });
      if (result.error) {
        alert(result.error.message);
      } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        await API.put(`/orders/${orderId}/status`, { status: "Paid" }, { headers: { Authorization: `Bearer ${token}` }});
        alert("Payment successful");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Card details</label>
      <div style={{ padding: 12, background: "#0b1220", borderRadius: 8, marginTop: 6 }}>
        <CardElement />
      </div>
      <button className="btn btn-primary" type="submit" disabled={loading || !stripe} style={{ marginTop: 12 }}>
        {loading ? "Processing…" : `Pay ₹${(amount/100).toFixed(2)}`}
      </button>
    </form>
  );
}
