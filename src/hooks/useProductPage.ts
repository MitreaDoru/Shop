import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  selectCart,
  selectProducts,
} from "../features/actions/actionsSelectors";
import { add, increment, decrement } from "../features/actions/cartSlice";
import type { AppDispatch } from "../app/store";

export const useProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const products = useSelector(selectProducts);
  const cart = useSelector(selectCart);

  const product = products.find((item) => item._id === id) || null;

  const cartItem = cart.find((item) => item._id === id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = () => {
    if (product) dispatch(add({ ...product, quantity: 1 }));
  };

  const handleIncrement = () => {
    if (id) dispatch(increment({ _id: id }));
  };

  const handleDecrement = () => {
    if (id) dispatch(decrement({ _id: id }));
  };

  return {
    product,
    quantity,
    handleAdd,
    handleIncrement,
    handleDecrement,
  };
};
