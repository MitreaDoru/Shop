import type { IngredientRecived } from './../../types/ingredients';
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  _id: string;
  image: string;
  name: string;
  price: number;
  quantity: number;
  ingredients: IngredientRecived[];
}
interface CartState {
  items: CartItem[];
}
const loadCartFromStorage = (): CartItem[] => {
  try {
    const data = localStorage.getItem("cart");
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};
const initialState: CartState = {
  items: loadCartFromStorage(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    add: (
      state,
      action: PayloadAction<{
        _id: string;
        image: string;
        name: string;
        price: number;
        quantity: number;
        ingredients: IngredientRecived[];
      }>,
    ) => {
      const existingItem = state.items?.find(
        (item) => item._id === action.payload._id,
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
        localStorage.setItem("cart", JSON.stringify(state.items));
      } else {
        state.items?.push(action.payload);
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },
    clear: (state) => {
      state.items = [];
      localStorage.removeItem("cart");
    },
    remove: (
      state,
      action: PayloadAction<{
        id: string;
      }>,
    ) => {
      state.items = state.items.filter(
        (item) => item._id !== action.payload.id,
      );
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    increment: (
      state,
      action: PayloadAction<{
        _id: string;
      }>,
    ) => {
      const item = state.items.find((item) => item._id === action.payload._id);
      if (!item) return;
      item.quantity += 1;
      localStorage.setItem("cart", JSON.stringify(state.items));
    },
    decrement: (state, action: PayloadAction<{ _id: string }>) => {
      const item = state.items.find((item) => item._id === action.payload._id);

      if (!item) return;

      if (item.quantity > 1) {
        item.quantity -= 1;
        localStorage.setItem("cart", JSON.stringify(state.items));
      } else {
        state.items = state.items.filter(
          (item) => item._id !== action.payload._id,
        );
        localStorage.setItem("cart", JSON.stringify(state.items));
      }
    },
  },
});

export const { add, remove, increment, decrement, clear } = cartSlice.actions;
export default cartSlice.reducer;
