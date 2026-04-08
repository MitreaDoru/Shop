import { Router } from "express";
import {
  createOrder,
  deleteOrder,
  getOrders,
  updateOrder,
} from "../controllers/order";
import { isAuth } from "../middleware/auth";
const { body } = require("express-validator");

const router = Router();
router.post(
  "/order",
  isAuth,
  [body("cart").isArray({ min: 1 }).withMessage("Coșul este gol")],
  createOrder,
);

router.get("/orders", isAuth, getOrders);
router.delete("/order", isAuth, deleteOrder);
router.patch("/order", isAuth, updateOrder);

export default router;
