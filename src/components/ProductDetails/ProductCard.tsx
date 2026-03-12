import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { add, increment, decrement } from "../../features/actions/cartSlice";
import type { AppDispatch } from "../../app/store";
import { selectCart } from "../../features/actions/actionsSelectors";
import type { Product } from "../../types/product";
function ProductCard({ item }: { item: Product }) {
  const cart = useSelector(selectCart);
  const dispatch = useDispatch<AppDispatch>();
  const existInCart = cart.filter((cartItem) => cartItem._id === item._id);
  return (
    <div className="card">
      <Link
        to={`/Candle/product/${item._id}`}
        style={{ textDecoration: "none", display: "block" }}
      >
        <img
          src={`./assets/${item.image}`}
          alt={item.name}
          style={{ cursor: "pointer", display: "block" }}
          width={200}
          height={200}
        />
      </Link>
      <div className="actions">
        {(existInCart.length > 0 ? existInCart[0].quantity : 0) === 0 && (
          <button
            className="btn"
            onClick={() => {
              dispatch(add({ ...item, quantity: 1 }));
            }}
          >
            Add to Cart
          </button>
        )}
        {(existInCart.length > 0 ? existInCart[0].quantity : 0) > 0 && (
          <div className="quantity">
            <button
              className="btn"
              onClick={() => {
                dispatch(decrement({ _id: item._id }));
              }}
            >
              -
            </button>
            <p className="count">{`${existInCart.length > 0 ? existInCart[0].quantity : 0}`}</p>
            <button
              className="btn"
              onClick={() => {
                dispatch(increment({ _id: item._id }));
              }}
            >
              +
            </button>
          </div>
        )}
        <p className="price">${item.price.toFixed(2)}</p>
      </div>
    </div>
  );
}
export default ProductCard;
