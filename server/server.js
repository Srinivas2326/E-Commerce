require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const connectDB = require("./src/config/db");

// Routes
const authRoutes = require("./src/routes/auth.routes");
const productRoutes = require("./src/routes/product.routes");
const orderRoutes = require("./src/routes/order.routes");
const userRoutes = require("./src/routes/user.routes");
const categoryRoutes = require("./src/routes/category.routes");
const reviewRoutes = require("./src/routes/review.routes");
const paymentRoutes = require("./src/routes/payment.routes");

const { notFound, errorHandler } = require("./src/middleware/error.middleware");

const app = express();

// 1. Connect to DB
connectDB();


app.use((req, res, next) => {
  if (req.originalUrl === "/api/payments/webhook") {
    // Skip express.json() for Stripe webhook
    return next();
  }
  return express.json()(req, res, next);
});

// 3. Other global middlewares
app.use(cookieParser());
app.use(morgan("dev"));

// 4. CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

if (process.env.CLIENT_URL) {
  allowedOrigins.push(process.env.CLIENT_URL);
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser tools like Postman (no Origin header)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("❌ Blocked by CORS:", origin);
    return callback(new Error("Not allowed by CORS"), false);
  },
  credentials: true,
};

app.use(cors(corsOptions));

/**
 * 5. API Routes
 */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/payments", paymentRoutes); // includes /create-payment-intent and /webhook

// 6. Health Check
app.get("/", (req, res) => {
  res.send("E-commerce API is running...");
});

// 7. Error handlers
app.use(notFound);
app.use(errorHandler);

// 8. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
