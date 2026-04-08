import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import type { GoogleLoginRequest } from "../types/googleAuth";

export const generateAuthResponse = (
  user: { _id: string; email: string; isAdmin: boolean },
  message: string,
) => {
  const token = jwt.sign(
    { userId: user._id, email: user.email, isAdmin: user.isAdmin },
    process.env.JWT_SECRET!,
    { expiresIn: "24h" },
  );

  return {
    token,
    user: { id: user._id, email: user.email, isAdmin: user.isAdmin },
    alert: { title: "Succes", message },
  };
};
export const loginGoogle = async (
  req: GoogleLoginRequest,
  res: Response,
  next: NextFunction,
) => {
  const { email, name, googleId } = req.googleProfile!;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        email,
        name,
        googleId,
        isAdmin: false,
        password: await bcrypt.hash(Math.random().toString(36).slice(-10), 12),
      });
      await user.save();
    }

    res.status(200).json(generateAuthResponse(user, `Bine ai venit, ${name}!`));
  } catch (err) {
    next(err);
  }
};

export const getLogin = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        alert: { title: "Eroare Validare", message: errors.array()[0].msg },
      });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.password) {
      return res.status(401).json({
        alert: {
          title: "Autentificare eșuată",
          message: "Email sau parolă incorectă",
        },
      });
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      return res.status(401).json({
        alert: {
          title: "Autentificare eșuată",
          message: "Email sau parolă incorectă",
        },
      });
    }

    res.status(200).json(generateAuthResponse(user, "Te-ai logat cu succes!"));
  } catch (err) {
    next(err);
  }
};
