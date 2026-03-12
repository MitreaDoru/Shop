import mongoose from "mongoose";
import { ingredientItemSchema } from "./ingredients";

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  ingredients: [ingredientItemSchema],
});

export default mongoose.model("Product", productSchema);
