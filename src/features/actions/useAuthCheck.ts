import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode } from "jwt-decode";
import { logoutUser } from "./authSlice";
import { editOrder } from "./ordersSlice";
import { selectOrderToEdit } from "./actionsSelectors";
import { clear } from "./cartSlice";

export const useAuthCheck = () => {
  const dispatch = useDispatch();
  const orderToEdit = useSelector(selectOrderToEdit);
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");

      if (!token || token === "null") {
        dispatch(logoutUser());
        return;
      }

      try {
        const cleanToken = token.replace(/["]/g, "");
        const decoded: { exp: number } = jwtDecode(cleanToken);
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          dispatch(logoutUser());
          dispatch(editOrder(null));
          if (orderToEdit) {
            dispatch(clear());
          }
        }
      } catch (error) {
        console.log(error);
        dispatch(logoutUser());
      }
    };
    checkAuth();
    window.addEventListener("click", checkAuth);
    return () => window.removeEventListener("click", checkAuth);
  }, [dispatch, orderToEdit]);
};
