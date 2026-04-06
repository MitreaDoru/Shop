import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { remove, increment, decrement } from "../../features/actions/cartSlice";
import type { AppDispatch } from "../../app/store";
import type { Product } from "../../types/product";
function CartCard({ item }: { item: Product }) {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <div className="cart-item">
      <Link to={`/product/${item._id}`} className="cart-item__image-container">
        <img
          src={`${item.image}`}
          alt={item.name}
          className="cart-item__image"
        />
      </Link>

      <div className="cart-item__content">
        <div className="cart-item__info">
          <h3 className="cart-item__name">{item.name}</h3>
        </div>

        <div className="cart-item__actions">
          <div className="cart-item__quantity">
            <button
              className="cart-item__btn-qty"
              onClick={() => dispatch(decrement({ _id: item._id }))}
            >
              -
            </button>
            <span className="cart-item__count">{item.quantity}</span>
            <button
              className="cart-item__btn-qty"
              onClick={() => dispatch(increment({ _id: item._id }))}
            >
              +
            </button>
          </div>

          <button
            className="cart-item__btn-delete"
            onClick={() => dispatch(remove({ id: item._id }))}
          >
            Șterge
          </button>
        </div>
      </div>
    </div>
  );
}
export default CartCard;
