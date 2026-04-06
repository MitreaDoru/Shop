import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCart,
  selectProducts,
} from "../features/actions/actionsSelectors";
import type { AppDispatch } from "../app/store";
import { add, increment, decrement } from "../features/actions/cartSlice";
import type { Product } from "../types/product";
const ProductPage = () => {
  const [activeTab, setActiveTab] = useState("detalii");
  const { id } = useParams(); // id is string
  const [product, setProduct] = useState<Product | null>(null);
  const cart = useSelector(selectCart);
  const products = useSelector(selectProducts);
  const dispatch = useDispatch<AppDispatch>();
  const existInCart = cart.filter((cartItem) => cartItem._id === id);

  useEffect(() => {
    if (id) {
      const foundProduct = products.find((item) => item._id === id);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProduct(foundProduct || null);
    }
  }, [id, products]);

  if (!product) return <h2>Product not found</h2>;
  return (
    <div className="product-page">
      <div className="container">
        <div className="product-hero">
          <div className="product-hero__gallery">
            <img
              className="product-hero__main-image"
              src={`${product.image}`}
              alt={product.name}
            />
          </div>

          <div className="product-hero__info">
            <h1 className="product-hero__title">{product.name}</h1>
            <p className="product-hero__description">
              Descoperă calitatea premium a produselor noastre artizanale,
              create cu atenție la detalii.
            </p>

            <div className="product-hero__actions">
              {(existInCart.length > 0 ? existInCart[0].quantity : 0) === 0 ? (
                <button
                  className="product-hero__btn-add"
                  onClick={() => dispatch(add({ ...product, quantity: 1 }))}
                >
                  Adaugă în listă
                </button>
              ) : (
                <div className="product-hero__quantity">
                  <button
                    className="product-hero__btn-qty"
                    onClick={() => dispatch(decrement({ _id: product._id }))}
                  >
                    -
                  </button>
                  <span className="product-hero__count">
                    {existInCart[0].quantity}
                  </span>
                  <button
                    className="product-hero__btn-qty"
                    onClick={() => dispatch(increment({ _id: product._id }))}
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="product-tabs">
          <div className="product-tabs__nav">
            <button
              className={`product-tabs__btn ${activeTab === "detalii" ? "is-active" : ""}`}
              onClick={() => setActiveTab("detalii")}
            >
              Detalii
            </button>
            <button
              className={`product-tabs__btn ${activeTab === "specificatii" ? "is-active" : ""}`}
              onClick={() => setActiveTab("specificatii")}
            >
              Specificații
            </button>
          </div>

          <div className="product-tabs__content">
            {activeTab === "detalii" && (
              <div className="product-tabs__panel">
                <p>
                  Acest produs este realizat manual folosind tehnici
                  tradiționale și materiale eco-friendly.
                </p>
              </div>
            )}

            {activeTab === "specificatii" && (
              <div className="product-tabs__panel">
                <table className="product-tabs__table">
                  <tbody>
                    <tr>
                      <td>Diametru</td>
                      <td>85 mm</td>
                    </tr>
                    <tr>
                      <td>Înălțime</td>
                      <td>100 mm</td>
                    </tr>
                    <tr>
                      <td>Greutate</td>
                      <td>350g</td>
                    </tr>
                    <tr>
                      <td>Material</td>
                      <td>Ceară Naturală</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
