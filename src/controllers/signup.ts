import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { generateAuthResponse } from "./login";

export const postSignup = async (
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

    const { email, password, name } = req.body;

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = new User({
      email,
      name: name || email.split("@")[0],
      password: hashedPassword,
      isAdmin: false,
    });

    await user.save();

    res.status(201).json({
      alert: {
        title: "Cont creat",
        message: "Contul a fost creat cu succes! Acum te poți autentifica.",
      },
    });
  } catch (err: any) {
    next(err);
  }
};
