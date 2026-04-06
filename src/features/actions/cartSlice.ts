import type { OrderItem } from "../../types/order";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  items: OrderItem[];
}
const loadCartFromStorage = (): OrderItem[] => {
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
    add: (state, action: PayloadAction<OrderItem>) => {
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
    setCart: (state, action: PayloadAction<OrderItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const { add, remove, increment, decrement, clear, setCart } =
  cartSlice.actions;
export default cartSlice.reducer;
