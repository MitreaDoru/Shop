import { useState } from "react";
import { useProductPage } from "../hooks/useProductPage";

const ProductPage = () => {
  const [activeTab, setActiveTab] = useState("detalii");
  const { product, quantity, handleAdd, handleIncrement, handleDecrement } =
    useProductPage();

  if (!product) {
    return (
      <div className="product-page">
        <h2 className="not-found">Produsul nu a fost găsit.</h2>
      </div>
    );
  }

  return (
    <div className="product-page">
      <div className="container">
        <div className="product-hero">
          <div className="product-hero__gallery">
            <img
              className="product-hero__main-image"
              src={product.image}
              alt={product.name}
            />
          </div>

          <div className="product-hero__info">
            <h1 className="product-hero__title">{product.name}</h1>
            <p className="product-hero__description">
              Descoperă calitatea premium a produselor noastre artizanale,
              create cu atenție la detalii și pasiune pentru frumos.
            </p>

            <div className="product-hero__actions">
              {quantity === 0 ? (
                <button className="product-hero__btn-add" onClick={handleAdd}>
                  Adaugă în listă
                </button>
              ) : (
                <div className="product-hero__quantity">
                  <button
                    className="product-hero__btn-qty"
                    onClick={handleDecrement}
                  >
                    -
                  </button>
                  <span className="product-hero__count">{quantity}</span>
                  <button
                    className="product-hero__btn-qty"
                    onClick={handleIncrement}
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
                  tradiționale și materiale eco-friendly. Fiecare piesă este
                  unică și reflectă grija noastră pentru mediul înconjurător.
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
