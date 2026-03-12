import { ingredientsSchema } from "./ingredients";

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  cartItems: [
    {
      _id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      ingredients: {
        type: [ingredientsSchema],
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
});

export default module.exports = mongoose.model("Order", orderSchema);
