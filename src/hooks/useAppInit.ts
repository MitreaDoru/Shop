import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addProduct, ingredients } from "../features/actions/productSlice";
import { loginUser, logoutUser } from "../features/actions/authSlice";
import type { AppDispatch } from "../app/store";

export const useAppInit = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const initAppData = async () => {
      const token = localStorage.getItem("token");
      const baseUrl = import.meta.env.VITE_BE_URL;

      try {
        const dataRes = await fetch(`${baseUrl}/data`);
        const data = await dataRes.json();

        dispatch(addProduct(data.products));
        dispatch(ingredients(data.ingredients.ingredients));

        if (token && token !== "null") {
          const userRes = await fetch(`${baseUrl}/user`, {
            headers: { Authorization: `Bearer ${token.replace(/["]/g, "")}` },
          });

          if (userRes.ok) {
            const userData = await userRes.json();
            dispatch(loginUser(userData.user));
          } else {
            dispatch(logoutUser());
          }
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initAppData();
  }, [dispatch]);

  return { loading };
};
