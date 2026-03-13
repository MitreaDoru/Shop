import type { IngredientRecived } from "./../../types/ingredients";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "../../types/product";

interface ActionsState {
  products: Product[];
  ingredients: IngredientRecived[];
}

const initialState: ActionsState = {
  products: [],
  ingredients: [],
};
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product | Product[]>) => {
      const newProducts = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      newProducts.forEach((p) => {
        if (!state.products.find((prod) => prod._id === p._id)) {
          state.products.push(p);
        }
      });
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(
        (product) => product._id !== action.payload,
      );
    },
    ingredients: (state, action: PayloadAction<IngredientRecived[]>) => {
      state.ingredients = action.payload;
    },
  },
});

export const { addProduct, deleteProduct, ingredients } = productSlice.actions;
export default productSlice.reducer;
