import React from "react";
import { useSelector } from "react-redux";
import { selectAlert } from "../features/actions/actionsSelectors";
import IngredientsList from "../components/ProductDetails/IngredientsList";
import Alert from "../components/ProductDetails/Alert";
import ConfirmModal from "../components/ConfirmModal";
import { useAdminLogic } from "../hooks/useAdminLogic";

const Admin: React.FC = () => {
  const alertState = useSelector(selectAlert);
  const {
    state, setItems, setListName, setCategory, setSelectedImage, 
    setShowConfirm, setPendingAction, saveProduct, handleUpdateStatus
  } = useAdminLogic();

  const total = state.items.reduce((sum, item) => sum + item.value * item.multiplier, 0);

  const triggerConfirm = (id: string, status: string) => {
    setPendingAction({ id, status });
    setShowConfirm(true);
  };

  return (
    <div className="admin-view">
      <section className="calculator">
        <h2 className="calculator__title">Create Product</h2>
        <div className="calculator__form-main">
          <div className="calculator__row-top">
            <input
              type="text" 
              placeholder="Product Name"
              value={state.listName}
              onChange={(e) => setListName(e.target.value)}
              className="calculator__input"
            />
            <select 
              value={state.category} 
              onChange={(e) => setCategory(e.target.value)}
              className="calculator__select"
            >
              <option value="" disabled>Selectează categoria</option>
              <option value="tablouri">🖼️ Tablouri</option>
              <option value="candele">🕯️ Candele</option>
              <option value="altele">📦 Altele</option>
            </select>
            <div className="calculator__file-box">
              <input 
                type="file" id="file-upload" hidden
                onChange={(e) => e.target.files && setSelectedImage(e.target.files[0])} 
              />
              <label htmlFor="file-upload" className="calculator__file-label">
                {state.selectedImage ? "✓ Imagine OK" : "📁 Încarcă Foto"}
              </label>
            </div>
          </div>
        </div>

        <div className="calculator__items-container">
          {state.items.map((item) => (
            <IngredientsList key={item._id} item={item} items={state.items} setItems={setItems} />
          ))}
        </div>

        <div className="calculator__footer">
          <div className="calculator__total-display">Total: <span>{total.toFixed(2)} RON</span></div>
          <button onClick={saveProduct} className="calculator__btn-save">Save Product</button>
        </div>
      </section>

      <section className="orders">
        <h2 className="orders__title">Comenzi în Așteptare</h2>
        <div className="orders__grid">
          {state.activeOrders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-card__header">
                <h3><strong>Email:</strong> {order.email}</h3>
                <h4>{order.totalPrice.toFixed(2)} RON</h4>
              </div>
              <div className="order-card__items-list">
                {order.orderItems.map((item) => (
                  <div key={item._id} className="order-card__item">
                    <img src={item.image} alt={item.name} />
                    <div className="order-card__item-info">
                      <h3>{item.name}</h3>
                      <p>Cantitate: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-card__actions">
                <button className="btn" onClick={() => triggerConfirm(order._id, "Procesare")}>În Procesare</button>
                <button className="btn" onClick={() => triggerConfirm(order._id, "Finalizata")}>Finalizată</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ConfirmModal
        isOpen={state.showConfirm}
        title={state.pendingAction?.status === "Finalizata" ? "Finalizare" : "Procesare"}
        message="Confirmi schimbarea statusului pentru această comandă?"
        onConfirm={() => {
          if (state.pendingAction) handleUpdateStatus(state.pendingAction.id, state.pendingAction.status);
          setShowConfirm(false);
        }}
        onCancel={() => setShowConfirm(false)}
      />
      {alertState.showAlert && <Alert />}
    </div>
  );
};

export default Admin;