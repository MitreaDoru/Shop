import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectOrders, selectUser } from "../features/actions/actionsSelectors";
import {
  setOrders,
  removeOrder,
  editOrder,
} from "../features/actions/ordersSlice";
import { alert, closeAlert, logoutUser } from "../features/actions/authSlice";
import { add, clear } from "../features/actions/cartSlice";
import type { AppDispatch } from "../app/store";
import type { Order, OrderItem } from "../types/order";

export const useOrdersLogic = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const orders = useSelector(selectOrders);
  const user = useSelector(selectUser);
  const token = localStorage.getItem("token");

  const [isLoading, setIsLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !user?.email) {
      navigate("/");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BE_URL}/orders`, {
          headers: { Authorization: `Bearer ${token.replace(/["]/g, "")}` },
        });

        if (response.status === 401) {
          dispatch(logoutUser());
          navigate("/");
          return;
        }

        const data = await response.json();
        if (data?.orders) dispatch(setOrders(data.orders));
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [token, user, navigate, dispatch]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BE_URL}/order`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.replace(/["]/g, "")}`,
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(removeOrder(id));
        dispatch(alert(data.alert));
        setTimeout(() => dispatch(closeAlert()), 2000);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const startEdit = (order: Order) => {
    dispatch(clear());
    dispatch(editOrder(order._id));
    order.orderItems.forEach((item: OrderItem) => dispatch(add(item)));
    navigate("/cart");
  };

  const triggerConfirm = (id: string) => {
    setPendingActionId(id);
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    if (pendingActionId) handleDelete(pendingActionId);
    setShowConfirm(false);
  };

  return {
    orders,
    isLoading,
    showConfirm,
    setShowConfirm,
    triggerConfirm,
    confirmDelete,
    startEdit,
    user,
  };
};
