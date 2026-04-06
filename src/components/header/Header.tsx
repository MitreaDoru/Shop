import { Link, useNavigate } from "react-router-dom";
import {
  selectCart,
  selectUser,
} from "../../features/actions/actionsSelectors";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import Login from "../auth/Signup-Login";
import { logoutUser, switchMode } from "../../features/actions/authSlice";
import { setOrders } from "../../features/actions/ordersSlice";
function Header() {
  const cart = useSelector(selectCart);
  const user = useSelector(selectUser);
  const [showLogin, setShowLogin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const itemsCount = cart
    .map((item) => item.quantity)
    .reduce((total, quantity) => total + quantity, 0);
  return (
    <header className="header">
      <Link
        className="header__logo"
        to="/Candle/"
        onClick={() => setIsMenuOpen(false)}
      >
        <img
          src="/Candle/assets/candle-logo.png"
          alt="logo"
          className="header__logo-img"
        />
        <p className="header__brand">Light & Art</p>
      </Link>

      <button
        className="header__burger"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Menu"
      >
        <span
          className={`header__burger-line ${isMenuOpen ? "header__burger-line--open" : ""}`}
        ></span>
        <span
          className={`header__burger-line ${isMenuOpen ? "header__burger-line--open" : ""}`}
        ></span>
        <span
          className={`header__burger-line ${isMenuOpen ? "header__burger-line--open" : ""}`}
        ></span>
      </button>

      <nav className={`header__nav ${isMenuOpen ? "header__nav--active" : ""}`}>
        <div className="header__nav-list">
          {user?.isAdmin && (
            <Link
              className="header__nav-link"
              to="/Candle/admin"
              onClick={() => setIsMenuOpen(false)}
            >
              Admin
            </Link>
          )}
          {!user?.isAdmin && user?.email && (
            <Link
              className="header__nav-link"
              to="/Candle/orders"
              onClick={() => setIsMenuOpen(false)}
            >
              Orders
            </Link>
          )}
          <Link
            className="header__nav-link"
            to="/Candle/"
            onClick={() => setIsMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            className="header__nav-link"
            to="/Candle/products"
            onClick={() => setIsMenuOpen(false)}
          >
            All Products
          </Link>
        </div>

        <div className="header__actions">
          <div className="header__cart">
            <Link
              to="/Candle/cart"
              className="header__cart-link"
              onClick={() => setIsMenuOpen(false)}
            >
              <img
                src="/Candle/assets/cart.png"
                alt="cart"
                className="header__icon"
              />
              {itemsCount > 0 && (
                <span className="header__cart-count">{itemsCount}</span>
              )}
            </Link>
          </div>

          {!user?.email ? (
            <div
              onClick={() => {
                setShowLogin(true);
                setIsMenuOpen(false);
              }}
              className="header__user"
            >
              <img
                src="/Candle/assets/user.png"
                alt="user"
                className="header__icon"
              />
            </div>
          ) : (
            <div className="header__auth-btns">
              <button
                onClick={() => {
                  dispatch(setOrders([]));
                  dispatch(logoutUser());
                  navigate("/Candle/");
                  setIsMenuOpen(false);
                }}
                className="header__btn header__btn--logout"
              >
                Logout
              </button>
              {user?.isAdmin && (
                <button
                  onClick={() => {
                    setShowLogin(true);
                    setIsMenuOpen(false);
                    dispatch(switchMode());
                  }}
                  className="header__btn header__btn--admin"
                >
                  Adauga cont
                </button>
              )}
            </div>
          )}
        </div>
      </nav>

      <Login isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </header>
  );
}

export default Header;
