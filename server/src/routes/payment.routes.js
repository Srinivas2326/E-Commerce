const express = require("express");
const Stripe = require("stripe");
const Order = require("../models/order.model");
const { protect } = require("../middleware/auth.middleware");

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

/**
 * 1️⃣ Create PaymentIntent for an order
 */
router.post("/create-payment-intent", protect, async (req, res) => {
  try {
    const { amount, currency = "inr", orderId } = req.body;

    if (!amount || !orderId) {
      return res
        .status(400)
        .json({ message: "Amount and orderId are required" });
    }

    const intAmount = Math.round(Number(amount)); // paise for INR
    if (!Number.isFinite(intAmount) || intAmount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    console.log(
      "🧾 Creating PaymentIntent — Order:",
      orderId,
      "Amount:",
      intAmount
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: intAmount,
      currency,
      payment_method_types: ["card"], // Prevents Stripe warnings
      metadata: { orderId },
    });

    return res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error("❌ Stripe PaymentIntent Error:", err);
    return res
      .status(500)
      .json({ message: "Failed to create payment intent" });
  }
});

/**
 * 2️⃣ Stripe Webhook (NO AUTH required!)
 * IMPORTANT: Must use express.raw() middleware, not express.json()
 */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("❌ Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log("🔔 Stripe Webhook Event:", event.type);

    /**
     * 3️⃣ Handle successful payment finalization
     */
    if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object;
      const orderId = intent.metadata?.orderId;

      console.log("💰 Payment captured for Order:", orderId);

      if (orderId) {
        try {
          await Order.findByIdAndUpdate(orderId, {
            isPaid: true,
            paidAt: new Date(),
            status: "Paid",
            paymentInfo: {
              id: intent.id,
              amount: intent.amount_received,
              currency: intent.currency,
              method: intent.payment_method,
            },
          });

          console.log("✅ Order updated as Paid:", orderId);
        } catch (updateErr) {
          console.error("❌ Failed to update order status:", updateErr);
        }
      }
    }

    res.json({ received: true });
  }
);

module.exports = router;
