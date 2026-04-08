import { Request, Response } from "express";
import Product from "../models/product";
import Ingredients from "../models/ingredients";

interface MulterRequest extends Request {
  file?: any;
}

export const createProduct = async (
  req: MulterRequest,
  res: Response,
): Promise<void> => {
  try {
    let { name, category, items, ingredients } = req.body;
    const file = req.file;

    const parsedItems = typeof items === "string" ? JSON.parse(items) : items;
    const parsedIngredients =
      typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients;

    if (!name || !file) {
      res.status(400).json({
        alert: {
          title: "Eroare Validare",
          message: "Numele și imaginea sunt obligatorii.",
        },
      });
      return;
    }

    const price = parsedItems.reduce(
      (sum: number, item: any) =>
        sum + Number(item.value || 0) * Number(item.multiplier || 0),
      0,
    );

    const newProduct = new Product({
      name,
      image: file.path,
      category,
      price,
      quantity: 0,
      ingredients: parsedItems,
    });

    const resetIngredients = parsedIngredients.map((ing: any) => ({
      ...ing,
      multiplier: 0,
    }));

    await Promise.all([
      newProduct.save(),
      Ingredients.findOneAndUpdate(
        {},
        { $set: { ingredients: resetIngredients } },
        { upsert: true },
      ),
    ]);

    res.status(201).json({
      alert: { title: "Succes", message: "Produsul a fost creat." },
      product: newProduct,
    });
  } catch (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    res
      .status(500)
      .json({
        alert: {
          title: "Server Error",
          message: "Eroare la crearea produsului.",
        },
      });
  }
};

export const getData = async (_req: Request, res: Response): Promise<void> => {
  try {
    const [products, ingredientsData] = await Promise.all([
      Product.find().lean(),
      Ingredients.findOne().lean(),
    ]);

    res.status(200).json({
      products: products || [],
      ingredients: ingredientsData?.ingredients || [],
    });
  } catch (error) {
    res
      .status(500)
      .json({ alert: { title: "Error", message: "Eroare la descărcare." } });
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      res
        .status(404)
        .json({ alert: { title: "Eroare", message: "Produsul nu există." } });
      return;
    }

    res.status(200).json({
      alert: { title: "Șters", message: "Produs eliminat." },
      id,
    });
  } catch (error) {
    res
      .status(500)
      .json({ alert: { title: "Error", message: "Eroare la ștergere." } });
  }
};
