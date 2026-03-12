import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Order from "../models/order";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        alert: { title: "Unauthorized", message: "No token provided" },
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        alert: {
          title: "User Not Found",
          message: "The user associated with this token was not found.",
        },
      });
    }

    const cart = req.body.cart;

    const totalPrice = cart
      .map((item: any) => item.price * item.quantity)
      .reduce((total: number, value: number) => total + value, 0);

    const newOrder = new Order({
      cartItems: cart,
      totalPrice,
    });

    await newOrder.save();
    user.orders.push(newOrder._id);
    await user.save();
    return res.status(201).json({
      alert: {
        title: "Order Created",
        message: "Your order was created successfully.",
      },
      order: newOrder,
    });
  } catch (err) {
    console.log(err);
    return res.status(401).json({
      alert: {
        title: "Invalid Token",
        message: "Your token is invalid or expired.",
      },
    });
  }
};
