import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Order } from "../../types/order";

interface ActionsState {
  orders: Order[];
  orderToEdit: Order | null;
}

const initialState: ActionsState = {
  orders: [],
  orderToEdit: null,
};
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order | Order[]>) => {
      const newOrders = Array.isArray(action.payload)
        ? action.payload
        : [action.payload];

      state.orders = newOrders;
    },
    editOrder: (state, action: PayloadAction<string | null>) => {
      if (action.payload === null) {
        state.orderToEdit = null;
      } else {
        const foundOrder = state.orders.find(
          (order) => order._id === action.payload,
        );
        state.orderToEdit = foundOrder || null;
      }
    },
    removeOrder: (state, action: PayloadAction<string>) => {
      state.orders = state.orders.filter(
        (order) => order._id !== action.payload,
      );
    },
  },
});

export const { setOrders, editOrder, removeOrder } = orderSlice.actions;
export default orderSlice.reducer;
