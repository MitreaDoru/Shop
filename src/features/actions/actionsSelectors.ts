import { type RootState } from "../../app/store";

export const selectCart = (state: RootState) => state.cart.items;
export const selectProducts = (state: RootState) => state.product.products;
export const selectIngredients = (state: RootState) =>
  state.product.ingredients;
export const selectUser = (state: RootState) => state.auth.user;
export const selectAlert = (state: RootState) => state.auth.alert;
export const selectMode = (state: RootState) => state.auth.mode;
export const selectOrders = (state: RootState) => state.orders.orders;
export const selectOrderToEdit = (state: RootState) => state.orders.orderToEdit;
