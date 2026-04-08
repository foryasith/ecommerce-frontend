const express = require("express");
const {
  checkoutOrder,
  getMyOrders,
  getOrderById,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/checkout", checkoutOrder);
router.get("/my-orders", getMyOrders);
router.get("/:id", getOrderById);

module.exports = router;