import { Router } from "express";
import { createOrder } from "../controllers/order";
const { body } = require("express-validator");
const router = Router();
router.post(
  "/cart",
  [body("cart", "Need to add somthing in cart").isArray({ min: 1 })],
  createOrder,
);

export default router;
