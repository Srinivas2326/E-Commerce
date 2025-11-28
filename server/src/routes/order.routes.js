const express = require("express");
const { createOrder, getMyOrders } = require("../controllers/order.controller");
const { protect } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/my-orders", protect, getMyOrders);

module.exports = router;
