import React from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

export default function PaymentForm({ clientSecret, onSuccess, onFail }) {
  const stripe = useStripe();
  const elements = useElements();

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        console.error(result.error.message);
        return onFail(result.error.message);
      }

      if (result.paymentIntent.status === "succeeded") {
        onSuccess();
      }
    } catch (err) {
      console.error(err);
      onFail("Payment failed");
    }
  };

  return (
    <form onSubmit={handlePayment} style={{ marginTop: "1rem" }}>
      <CardElement
        options={{
          style: {
            base: {
              fontSize: "16px",
              color: "#e5e7eb",
              "::placeholder": {
                color: "#6b7280",
              },
            },
            invalid: {
              color: "#f87171",
            },
          },
        }}
      />

      <button
        type="submit"
        disabled={!stripe}
        className="btn btn-primary btn-block"
        style={{ marginTop: "1rem" }}
      >
        Pay Now
      </button>
    </form>
  );
}
