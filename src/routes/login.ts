import { Router } from "express";
import { getLogin } from "../controllers/login";
const bcrypt = require("bcryptjs");
const { body } = require("express-validator");
const router = Router();
export const getLoginRoute = router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Enter a valid email").normalizeEmail(),

    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters"),
  ],
  getLogin,
);
