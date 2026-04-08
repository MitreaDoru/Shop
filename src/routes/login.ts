import { Router } from "express";
import { body } from "express-validator";
import { getLogin, loginGoogle } from "../controllers/login";
import { verifyGoogleToken } from "../middleware/verifyGoogleToken";
const router = Router();
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Enter a valid email").normalizeEmail(),

    body("password")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 characters"),
  ],
  getLogin,
);
router.post("/google/login", verifyGoogleToken, loginGoogle);
export default router;
