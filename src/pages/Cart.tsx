import { useDispatch, useSelector } from "react-redux";
import {
  selectAlert,
  selectCart,
  selectUser,
} from "../features/actions/actionsSelectors";
import CartCard from "../components/ProductDetails/CartCard";
import { alert, closeAlert } from "../features/actions/authSlice";
import { clear } from "../features/actions/cartSlice";
import type { AppDispatch } from "../app/store";
import Alert from "../components/ProductDetails/Alert";
import { useNavigate } from "react-router-dom";
import Login from "../components/auth/Signup-Login";
import { useState } from "react";
function Cart() {
  const cart = useSelector(selectCart);
  const user = useSelector(selectUser);
  const alertState = useSelector(selectAlert);
  const dispatch = useDispatch<AppDispatch>();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const totalPrice = cart
    .map((item) => item.price * item.quantity)
    .reduce((total, price) => total + price, 0);
  const sendHandler = () => {
    fetch("https://candle-uqyt.onrender.com/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cart, userId: user._id }),
    })
      .then((result) => result.json())
      .then((data) => {
        if (data.alert.title === "Order Created") {
          dispatch(alert(data.alert));
          setTimeout(() => {
            dispatch(closeAlert());
          }, 2000);
          dispatch(clear());
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="cart-page">
      {totalPrice > 0 ? (
        <div className="cart">
          {cart.map((item) => (
            <CartCard key={item._id} item={item} />
          ))}
          <p className="final-price">Total: ${totalPrice.toFixed(2)}</p>

          <button
            className="btn order"
            onClick={token ? sendHandler : () => setShowLogin(true)}
          >
            Order
          </button>
          <Login isOpen={showLogin} onClose={() => setShowLogin(false)} />
        </div>
      ) : (
        <div className="empty-cart">
          <img src="/Candle/assets/empty-cart.png" alt="empty cart" />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any candles yet.</p>

          <button className="btn-shop" onClick={() => navigate("/Candle")}>
            Continue Shopping
          </button>
        </div>
      )}
      {alertState.showAlert && <Alert />}
    </div>
  );
}

export default Cart;
