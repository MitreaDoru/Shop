import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import User from "../models/User";
import Order from "../models/order";
import Product from "../models/product";

export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { cart } = req.body;
    const { userId, email } = req.user!;
    
    for (const item of cart) {
      const exists = await Product.exists({ _id: item._id });
      if (!exists) {
        return res.status(400).json({
          alert: { title: "Produs Indisponibil", message: `Produsul "${item.name}" nu mai există.` }
        });
      }
    }

    const totalPrice = cart.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

    const newOrder = await new Order({
      orderItems: cart,
      totalPrice,
      email,
      status: "Trimisa",
    }).save();

    await User.findByIdAndUpdate(userId, { $push: { orders: newOrder._id } });

    res.status(201).json({
      alert: { title: "Succes", message: "Comanda a fost creată." },
      order: newOrder,
    });
  } catch (err) {
    res.status(500).json({ message: "Eroare server" });
  }
};

export const getOrders = async (req: AuthRequest, res: Response) => {
  try {
    const { email, isAdmin } = req.user!;
    const filter = isAdmin ? {} : { email };
    
    const orders = await Order.find(filter).lean();
    res.status(200).json({ orders });
  } catch (err) {
    res.status(500).json({ message: "Eroare la descărcare" });
  }
};

export const deleteOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.body;
    const { email, isAdmin } = req.user!;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Nu există comanda." });

    if (!isAdmin && order.email !== email) {
      return res.status(403).json({ alert: { title: "Refuzat", message: "Nu e comanda ta!" } });
    }

    await Order.findByIdAndDelete(id);
    res.status(200).json({ alert: { title: "Succes", message: "Comandă procesată." } });
  } catch (err) {
    res.status(500).json({ message: "Eroare la ștergere" });
  }
};

export const updateOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { id, updates } = req.body;
    const updatedOrder = await Order.findByIdAndUpdate(id, { $set: updates }, { new: true });

    if (!updatedOrder) return res.status(404).json({ message: "Comanda nu a fost găsită." });

    res.status(200).json({ alert: { title: "Succes", message: "Update reușit." }, order: updatedOrder });
  } catch (err) {
    res.status(500).json({ message: "Eroare la update" });
  }
};