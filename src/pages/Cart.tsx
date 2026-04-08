import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAlert } from "../features/actions/actionsSelectors";
import { editOrder } from "../features/actions/ordersSlice";
import CartCard from "../components/ProductDetails/CartCard";
import Alert from "../components/ProductDetails/Alert";
import Login from "../components/auth/Signup-Login";
import { useCartLogic } from "../hooks/useCartLogic";

function Cart() {
  const dispatch = useDispatch();
  const alertState = useSelector(selectAlert);
  const { cart, orderToEdit, showLogin, setShowLogin, submitOrder, navigate } =
    useCartLogic();

  useEffect(() => {
    if (cart.length === 0 && orderToEdit !== null) {
      dispatch(editOrder(null));
    }
  }, [cart.length, orderToEdit, dispatch]);

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <div className="empty-cart__icon-box">
            <img src="/assets/lista.png" alt="empty cart" />
          </div>
          <h2>Lista ta este goală</h2>
          <p>Adaugă produse pentru a putea cere o ofertă personalizată.</p>
          <button
            className="empty-cart__btn-home"
            onClick={() => navigate("/")}
          >
            Înapoi la magazin
          </button>
        </div>
        {alertState.showAlert && <Alert />}
      </div>
    );
  }

  return (
    <div className="cart-page">
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
          <button className="cart__btn-submit" onClick={submitOrder}>
            {orderToEdit
              ? "Salvează modificările"
              : "Trimite cererea de ofertă"}
          </button>
        </div>

        <Login isOpen={showLogin} onClose={() => setShowLogin(false)} />
      </div>
      {alertState.showAlert && <Alert />}
    </div>
  );
}

export default Cart;
