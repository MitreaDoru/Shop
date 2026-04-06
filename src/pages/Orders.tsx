import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAlert,
  selectOrders,
  selectUser,
} from "../features/actions/actionsSelectors";
import { add, clear } from "../features/actions/cartSlice";
import { useNavigate } from "react-router-dom";
import {
  editOrder,
  removeOrder,
  setOrders,
} from "../features/actions/ordersSlice";
import { alert, closeAlert, logoutUser } from "../features/actions/authSlice";
import Alert from "../components/ProductDetails/Alert";
import ConfirmModal from "../components/ConfirmModal";

const OrdersPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orders = useSelector(selectOrders);
  const user = useSelector(selectUser);
  const token = localStorage.getItem("token");
  const [isLoading, setIsLoading] = useState(true);
  const alertState = useSelector(selectAlert);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    id: string;
  } | null>(null);
  const triggerConfirm = (id: string) => {
    setPendingAction({ id });
    setShowConfirm(true);
  };
  const handleModalConfirm = () => {
    if (pendingAction) {
      handleDeleteOrder(pendingAction.id);
    }
    setShowConfirm(false);
  };
  useEffect(() => {
    if (!token || !user?.email) {
      navigate("/Candle");
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch("https://candle-1.onrender.com/orders", {
          headers: { Authorization: `Bearer ${token.replace(/["]/g, "")}` },
        });

        if (response.status === 401) {
          dispatch(logoutUser());
          navigate("/Candle");
          return;
        }

        const data = await response.json();
        if (data?.orders) dispatch(setOrders(data.orders));
      } catch (err) {
        console.error("Eroare la încărcarea comenzilor:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [token, user, navigate, dispatch]);
  const handleDeleteOrder = async (id: string) => {

    try {
      const response = await fetch("https://candle-1.onrender.com/order", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Eroare la ștergerea comenzii");

      const data = await response.json();

      dispatch(removeOrder(id));

      dispatch(alert(data.alert));

      setTimeout(() => {
        dispatch(closeAlert());
      }, 2000);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  if (isLoading && !orders.length) return <div>Loading...</div>;
  if (!user?.email) return null;
  return (
    <>
      {user?.email && (
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
                    <span className="orders__date">
                      Efectuată pe: {new Date().toLocaleDateString()}
                    </span>
                  </div>
                  <span className="orders__status">{order.status}</span>
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
                      onClick={() => {
                        dispatch(clear());
                        dispatch(editOrder(order._id));
                        order.orderItems.forEach((item) => dispatch(add(item)));
                        navigate("/Candle/cart");
                      }}
                    >
                      Editează
                    </button>
                    <button
                      className="orders__delete-btn"
                      onClick={() => triggerConfirm(order._id)}
                    >
                      {order.status === "Finalizata"
                        ? "Sterge"
                        : "Anulează Comanda"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <ConfirmModal
            isOpen={showConfirm}
            title="Sterge Comanda!"
            message="Esti sigur ca doresti sa stergi aceasta comanda?"
            onConfirm={handleModalConfirm}
            onCancel={() => setShowConfirm(false)}
          />
          {alertState.showAlert && <Alert />}
        </div>
      )}
    </>
  );
};

export default OrdersPage;
