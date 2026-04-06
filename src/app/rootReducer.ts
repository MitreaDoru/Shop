import { combineReducers } from "@reduxjs/toolkit";
import actionsReducer from "../features/actions/actionsSlice";
import cartReducer from "../features/actions/cartSlice";
import productReducer from "../features/actions/productSlice";
import authReducer from "../features/actions/authSlice";
import orderReducer from "../features/actions/ordersSlice";

const rootReducer = combineReducers({
  actions: actionsReducer,
  cart: cartReducer,
  product: productReducer,
  auth: authReducer,
  orders: orderReducer,
});

export default rootReducer;
