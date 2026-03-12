import { Request, Response } from "express";
import { ProductRequest, Item } from "../types/productTypes";
import Product from "../models/product";
import Ingredients from "../models/ingredients";

export const createProduct = async (
  req: Request<{}, {}, ProductRequest>,
  res: Response,
): Promise<void> => {
  try {
    const { name, items, ingredients, image } = req.body;

    if (!name) {
      res.status(400).json({
        alert: {
          title: "Validation Error",
          message: "Product name is required",
        },      
      });
      return;
    }

    const price = items.reduce(
      (sum: number, item: Item) => sum + item.value * item.multiplier,
      0,
    );

    const newProduct = new Product({
      name,
      image: image || "candle-1.jpg",
      price,
      quantity: 0,
      ingredients: items,
    });
    const allIngredients = ingredients.map((item: Item) => ({
      ...item,
      multiplier: 0,
    }));
    await Ingredients.findOneAndUpdate(
      {},
      { $set: { ingredients: allIngredients } },
      { upsert: true, returnDocument: "after" },
    );

    await newProduct.save();

    res.status(201).json({
      alert: {
        title: "Product Created",
        message: "The product has been created successfully.",
      },
      product: newProduct,
    });
  } catch (error) {
    res.status(500).json({
      alert: {
        title: "Server Error",
        message: "An error occurred while creating the product.",
      },
      error,
    });
  }
};

export const getData = async (req: Request, res: Response): Promise<void> => {
  try {
    const products = await Product.find();
    const ingredients = await Ingredients.findOne();

    res.status(200).json({
      products,
      ingredients,
    });
  } catch (error) {
    res.status(500).json({
      alert: {
        title: "Server Error",
        message: "An error occurred while fetching data.",
      },
      error,
    });
  }
};
