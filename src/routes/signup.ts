import { Router } from "express";
import { body } from "express-validator";
import { postSignup } from "../controllers/signup";
import User from "../models/User";

const router = Router();

export const postSignupRoute = router.post(
  "/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Enter a valid email")
      .custom(async (value: string) => {
        const user = await User.findOne({ email: value });

        if (user) {
          throw new Error("This email already exists");
        }

        return true;
      })
      .normalizeEmail(),

    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters"),
  ],
  postSignup,
);
