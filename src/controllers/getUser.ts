import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export const getUser = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "No token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const user = await User.findById(decoded.userId).select("-password");
    res.json({
      user,
      alert: {
        title: "User Data",
        message: "User data retrieved successfully.",
      },
    });
  } catch (err) {
    res.status(401).json({
      message: "Invalid token",
      alert: {
        title: "Invalid Token",
        message: "Your token is invalid or expired.",
      },
    });
  }
};
