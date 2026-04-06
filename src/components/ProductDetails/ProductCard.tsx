import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  add,
  increment,
  decrement,
  remove,
} from "../../features/actions/cartSlice";
import type { AppDispatch } from "../../app/store";
import {
  selectCart,
  selectUser,
} from "../../features/actions/actionsSelectors";
import type { Product } from "../../types/product";
import { useState } from "react";
import { deleteProduct } from "../../features/actions/productSlice";

function ProductCard({ item }: { item: Product }) {
  const cart = useSelector(selectCart);
  const user = useSelector(selectUser);
  const dispatch = useDispatch<AppDispatch>();
  const [showConfirm, setShowConfirm] = useState(false);

  const existInCart = cart.find((cartItem) => cartItem._id === item._id);

  const handleDelete = async () => {
    const token = localStorage.getItem("token")?.replace(/["]/g, "");

    try {
      const response = await fetch(
        `https://candle-1-ax6h.onrender.com/product/${item._id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (response.ok) {
        dispatch(deleteProduct(item._id));
        dispatch(remove({ id: item._id }));

        setShowConfirm(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="card">
      {user?.isAdmin && (
        <button
          className="card__delete-btn"
          onClick={() => setShowConfirm(true)}
        >
          &times;
        </button>
      )}

      {showConfirm && (
        <div className="card__confirm-overlay">
          <div className="card__confirm-content">
            <p>Ștergi definitiv produsul?</p>
            <div className="card__confirm-actions">
              <button onClick={handleDelete} className="card__btn-confirm">
                Da
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="card__btn-cancel"
              >
                Nu
              </button>
            </div>
          </div>
        </div>
      )}

      <Link to={`/product/${item._id}`} className="card__link">
        <img src={`${item.image}`} alt={item.name} className="card__img" />
      </Link>

      <div className="card__actions">
        {(!existInCart || existInCart.quantity === 0) && (
          <button
            className="card__add-btn"
            onClick={() => dispatch(add({ ...item, quantity: 1 }))}
          >
            Adauga
          </button>
        )}

        {existInCart && existInCart.quantity > 0 && (
          <div className="card__quantity">
            <button
              className="card__qty-btn"
              onClick={() => dispatch(decrement({ _id: item._id }))}
            >
              -
            </button>
            <p className="card__count">{existInCart.quantity}</p>
            <button
              className="card__qty-btn"
              onClick={() => dispatch(increment({ _id: item._id }))}
            >
              +
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
