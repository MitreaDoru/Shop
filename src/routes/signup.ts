import { Router } from "express";
import { body } from "express-validator";
import { postSignup } from "../controllers/signup";
import User from "../models/User";

const router = Router();

const signupValidation = [
  body("email")
    .isEmail()
    .withMessage("Te rugăm să introduci un email valid.")
    .custom(async (value) => {
      const user = await User.findOne({ email: value });
      if (user) throw new Error("Acest email este deja utilizat.");
      return true;
    })
    .normalizeEmail(),

  body("password")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Parola trebuie să aibă cel puțin 5 caractere."),
];

router.post("/signup", signupValidation, postSignup);

export default router;
