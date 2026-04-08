import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectIngredients,
  selectOrders,
} from "../features/actions/actionsSelectors";
import { addProduct } from "../features/actions/productSlice";
import { setOrders } from "../features/actions/ordersSlice";
import { alert, closeAlert, logoutUser } from "../features/actions/authSlice";
import type { IngredientRecived } from "../types/ingredients";
import type { AppDispatch } from "../app/store";

export const useAdminLogic = () => {
  const dispatch = useDispatch<AppDispatch>();
  const initialIngredients = useSelector(selectIngredients);
  const allOrders = useSelector(selectOrders);

  const [listName, setListName] = useState("");
  const [category, setCategory] = useState("");
  const [items, setItems] = useState<IngredientRecived[]>(initialIngredients);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    id: string;
    status: string;
  } | null>(null);

  const token = localStorage.getItem("token");

  const activeOrders = allOrders.filter(
    (order) => order.status !== "Finalizata",
  );

  const fetchOrders = useCallback(async () => {
    if (!token || token === "null") return;
    try {
      const response = await fetch(`${import.meta.env.VITE_BE_URL}/orders`, {
        headers: { Authorization: `Bearer ${token.replace(/["]/g, "")}` },
      });
      if (response.status === 401) {
        dispatch(logoutUser());
        return;
      }
      const data = await response.json();
      if (data?.orders) dispatch(setOrders(data.orders));
    } catch (err) {
      console.error("Eroare orders:", err);
    }
  }, [dispatch, token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BE_URL}/order`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token?.replace(/["]/g, "")}`,
        },
        body: JSON.stringify({ id, updates: { status } }),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(alert(data.alert));
        await fetchOrders();
        setTimeout(() => dispatch(closeAlert()), 2000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveProduct = async () => {
    if (!listName.trim() || !selectedImage) {
      dispatch(
        alert({
          title: "Eroare",
          message: "Numele și imaginea sunt obligatorii.",
        }),
      );
      return;
    }

    const cleanItems = items
      .filter((item) => item.multiplier > 0)
      .map((item) => ({
        label: item.label,
        value: item.value,
        multiplier: item.multiplier,
      }));
    const cleanIngredients = items.map((item) => ({
      label: item.label,
      value: item.value,
      multiplier: item.multiplier,
    }));

    const formData = new FormData();
    formData.append("name", listName);
    formData.append("image", selectedImage);
    formData.append("category", category);
    formData.append("items", JSON.stringify(cleanItems));
    formData.append("ingredients", JSON.stringify(cleanIngredients));

    try {
      const response = await fetch(`${import.meta.env.VITE_BE_URL}/product`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token?.replace(/["]/g, "")}` },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(addProduct(data.product));
        dispatch(alert(data.alert));
        setListName("");
        setCategory("");
        setSelectedImage(null);
        setItems(items.map((i) => ({ ...i, multiplier: 0 })));
        window.scrollTo({ top: 0, behavior: "smooth" });
        setTimeout(() => dispatch(closeAlert()), 2000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return {
    state: {
      listName,
      items,
      category,
      selectedImage,
      activeOrders,
      showConfirm,
      pendingAction,
    },
    setItems,
    setListName,
    setCategory,
    setSelectedImage,
    setShowConfirm,
    setPendingAction,
    saveProduct,
    handleUpdateStatus,
  };
};
