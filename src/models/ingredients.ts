import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const ingredientItemSchema = new Schema({
  label: { type: String, required: true },
  value: { type: Number, required: true },
  multiplier: { type: Number, required: true },
});

export const ingredientsSchema = new Schema({
  ingredients: [ingredientItemSchema],
});

export default mongoose.model("Ingredients", ingredientsSchema);
