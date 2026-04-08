import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  selectCart,
  selectOrderToEdit,
  selectUser,
} from "../features/actions/actionsSelectors";
import { alert, closeAlert, logoutUser } from "../features/actions/authSlice";
import { clear } from "../features/actions/cartSlice";
import { editOrder } from "../features/actions/ordersSlice";
import type { AppDispatch } from "../app/store";

export const useCartLogic = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const cart = useSelector(selectCart);
  const user = useSelector(selectUser);
  const orderToEdit = useSelector(selectOrderToEdit);

  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  const submitOrder = async () => {
    const currentToken = localStorage.getItem("token");

    if (orderToEdit && user && orderToEdit.email !== user.email) {
      dispatch(editOrder(null));
      dispatch(clear());
      return;
    }

    if (!currentToken || currentToken === "null") {
      dispatch(logoutUser());
      setShowLogin(true);
      return;
    }

    setLoading(true);
    const cleanToken = currentToken.replace(/["]/g, "");
    const url = `${import.meta.env.VITE_BE_URL}/order`;
    const method = orderToEdit ? "PATCH" : "POST";

    try {
      const payload = orderToEdit
        ? {
            id: orderToEdit._id,
            updates: { orderItems: cart, totalPrice: totalAmount },
          }
        : { cart, userId: user?._id };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${cleanToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        dispatch(logoutUser());
        setShowLogin(true);
        return;
      }

      const data = await response.json();

      if (response.ok) {
        navigate("/orders");
        dispatch(alert(data.alert));
        dispatch(clear());
        dispatch(editOrder(null));
        setTimeout(() => dispatch(closeAlert()), 2000);
      } else {
        dispatch(alert(data.alert));
      }
    } catch (err) {
      console.error("Network error:", err);
    } finally {
      setLoading(false);
    }
  };

  return {
    cart,
    user,
    orderToEdit,
    showLogin,
    setShowLogin,
    submitOrder,
    loading,
    navigate,
  };
};
