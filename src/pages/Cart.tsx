import { useDispatch, useSelector } from "react-redux";
import {
  selectAlert,
  selectCart,
  selectOrderToEdit,
  selectUser,
} from "../features/actions/actionsSelectors";
import CartCard from "../components/ProductDetails/CartCard";
import { alert, closeAlert, logoutUser } from "../features/actions/authSlice";
import { clear } from "../features/actions/cartSlice";
import type { AppDispatch } from "../app/store";
import Alert from "../components/ProductDetails/Alert";
import { useNavigate } from "react-router-dom";
import Login from "../components/auth/Signup-Login";
import { useEffect, useState } from "react";
import { editOrder } from "../features/actions/ordersSlice";
function Cart() {
  const cart = useSelector(selectCart);
  const user = useSelector(selectUser);
  const alertState = useSelector(selectAlert);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const orderToEdit = useSelector(selectOrderToEdit);

  useEffect(() => {
    if (cart.length === 0 && orderToEdit !== null) {
      dispatch(editOrder(null));
    }
  }, [cart.length, orderToEdit, dispatch]);

  const submitOrder = async () => {
    const currentToken = localStorage.getItem("token");

    if (orderToEdit && user && orderToEdit.email !== user.email) {
      dispatch(editOrder(null));
      dispatch(clear());
      return;
    }

    if (!currentToken) {
      setShowLogin(true);
      return;
    }

    const cleanToken = currentToken.replace(/["]/g, "");
    const url = orderToEdit
      ? "https://candle-1.onrender.com/order"
      : "https://candle-1.onrender.com/cart";
    const method = orderToEdit ? "PATCH" : "POST";

    const totalAmount = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );

    try {
      const payload = orderToEdit
        ? {
            id: orderToEdit._id,
            updates: {
              orderItems: cart,
              totalPrice: totalAmount,
            },
          }
        : { cart, userId: user?._id };

      const response = await fetch(url, {
        method: method,
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
        navigate("/Candle/orders");
        dispatch(alert(data.alert));
        dispatch(clear());
        dispatch(editOrder(null));

        setTimeout(() => {
          dispatch(closeAlert());
        }, 2000);
      } else {
        dispatch(alert(data.alert));
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };
  return (
    <div className="cart-page">
      {cart.length > 0 ? (
        <div className="cart">
          {orderToEdit && (
            <div className="edit-mode-tag">Mod de Editare Comandă</div>
          )}

          <h2 className="cart__title">Lista ta de cerere ofertă</h2>

          <div className="cart__items">
            {cart.map((item) => (
              <CartCard key={item._id} item={item} />
            ))}
          </div>

          <div className="cart__footer">
            <button
              className="cart__btn-submit"
              onClick={() => {
                const activeToken = localStorage.getItem("token");
                if (!user || !activeToken || activeToken === "null") {
                  dispatch(logoutUser());
                  setShowLogin(true);
                } else {
                  submitOrder();
                }
              }}
            >
              {orderToEdit
                ? "Salvează modificările"
                : "Trimite cererea de ofertă"}
            </button>
          </div>

          <Login isOpen={showLogin} onClose={() => setShowLogin(false)} />
        </div>
      ) : (
        <div className="empty-cart">
          <div className="empty-cart__icon-box">
            <img src="/Candle/assets/lista.png" alt="empty cart" />
          </div>
          <h2>Lista ta este goală</h2>
          <p>Adaugă produse pentru a putea cere o ofertă personalizată.</p>
          <button
            className="empty-cart__btn-home"
            onClick={() => navigate("/Candle/")}
          >
            Înapoi la magazin
          </button>
        </div>
      )}
      {alertState.showAlert && <Alert />}
    </div>
  );
}

export default Cart;
