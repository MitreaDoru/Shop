import React from "react";
import { useSelector } from "react-redux";
import { selectAlert } from "../features/actions/actionsSelectors";
import Alert from "../components/ProductDetails/Alert";
import ConfirmModal from "../components/ConfirmModal";
import { useOrdersLogic } from "../hooks/useOrdersLogic";

const OrdersPage: React.FC = () => {
  const alertState = useSelector(selectAlert);
  const {
    orders,
    isLoading,
    showConfirm,
    setShowConfirm,
    triggerConfirm,
    confirmDelete,
    startEdit,
    user,
  } = useOrdersLogic();

  if (isLoading && !orders.length)
    return <div className="loading">Se încarcă comenzile...</div>;
  if (!user?.email) return null;

  return (
    <div className="orders">
      <h1 className="orders__title">Comenzi</h1>
      <div className="orders__list">
        {orders.map((order) => (
          <div key={order._id} className="orders__order">
            <div className="orders__header">
              <div className="orders__info">
                <span className="orders__id">
                  Comanda # {order._id.slice(-6)}
                </span>
              </div>
              <span
                className={`orders__status orders__status--${order.status.toLowerCase()}`}
              >
                {order.status}
              </span>
            </div>

            <div className="orders__body">
              <div className="orders__items">
                {order.orderItems.map((item) => (
                  <div key={item._id} className="orders__item">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="orders__item-img"
                    />
                    <div className="orders__item-text">
                      <h4 className="orders__item-name">{item.name}</h4>
                      <p className="orders__item-qty">
                        Cantitate: {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="orders__actions">
                <button
                  className="orders__edit-btn"
                  onClick={() => startEdit(order)}
                >
                  Editează
                </button>
                <button
                  className="orders__delete-btn"
                  onClick={() => triggerConfirm(order._id)}
                >
                  {order.status === "Finalizata"
                    ? "Șterge"
                    : "Anulează Comanda"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        title="Șterge Comanda!"
        message="Ești sigur că dorești să ștergi această comandă?"
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirm(false)}
      />
      {alertState.showAlert && <Alert />}
    </div>
  );
};

export default OrdersPage;
