import React, { useCallback, useEffect, useState } from "react";
import {
  selectAlert,
  selectIngredients,
  selectOrders,
} from "../features/actions/actionsSelectors";
import { useDispatch, useSelector } from "react-redux";
import type { IngredientRecived, IngredientSent } from "../types/ingredients";
import IngredientsList from "../components/ProductDetails/IngredientsList";
import { alert, closeAlert, logoutUser } from "../features/actions/authSlice";
import type { AppDispatch } from "../app/store";
import { addProduct } from "../features/actions/productSlice";
import { setOrders } from "../features/actions/ordersSlice";
import Alert from "../components/ProductDetails/Alert";
import ConfirmModal from "../components/ConfirmModal";

const InputsCalculator: React.FC = () => {
  const [listName, setListName] = useState("");
  const [items, setItems] = useState<IngredientRecived[]>(
    useSelector(selectIngredients),
  );
  const [category, setCategory] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const orders = useSelector(selectOrders).filter(
    (order) => order.status !== "Finalizata",
  );
  const token = localStorage.getItem("token");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const alertState = useSelector(selectAlert);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    id: string;
    status: string;
  } | null>(null);
  const triggerConfirm = (id: string, status: string) => {
    setPendingAction({ id, status });
    setShowConfirm(true);
  };
  const handleModalConfirm = () => {
    if (pendingAction) {
      updateStatus(pendingAction.id, pendingAction.status);
    }
    setShowConfirm(false);
  };
  const addItem = () => {
    setItems([
      ...items,
      { _id: crypto.randomUUID(), label: "", value: 0, multiplier: 0 },
    ]);
  };

  const total = items.reduce(
    (sum, item) => sum + item.value * item.multiplier,
    0,
  );

  const saveList = async () => {
    if (!listName.trim() || !selectedImage) {
      dispatch(
        alert({
          title: "Product Name",
          message: "Please enter a product name.",
        }),
      );
      return;
    }

    const usedItems = items.filter((item) => item.multiplier > 0);
    const cleanItems: IngredientSent[] = usedItems.map((item) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...rest } = item;
      return rest;
    });
    const cleanIngredients: IngredientSent[] = items.map((item) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...rest } = item;
      return rest;
    });
    const formData = new FormData();
    formData.append("name", listName);
    formData.append("image", selectedImage);
    formData.append("category", category);
    formData.append("items", JSON.stringify(cleanItems));
    formData.append("ingredients", JSON.stringify(cleanIngredients));
    try {
      const response = await fetch("https://candle-1.onrender.com/product", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (!response.ok) {
        throw new Error("Failed to save product");
      }
      const data = await response.json();
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      const resetItems = items.map((item) => ({
        ...item,
        multiplier: 0,
      }));
      setItems(resetItems);
      setListName("");
      setSelectedImage(null);
      const fileInput = document.getElementById(
        "file-upload",
      ) as HTMLInputElement;
      if (fileInput) {
        fileInput.value = "";
      }
      setCategory("");
      dispatch(alert(data.alert));
      dispatch(addProduct(data.product));
      setTimeout(() => {
        dispatch(closeAlert());
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchOrders = useCallback(async () => {
    const currentToken = localStorage.getItem("token");
    if (!currentToken || currentToken === "null") return;

    try {
      const response = await fetch("https://candle-1.onrender.com/orders", {
        headers: { Authorization: `Bearer ${currentToken}` },
      });

      if (response.status === 401) {
        dispatch(logoutUser());
        return;
      }

      const data = await response.json();
      if (data && data.orders) {
        dispatch(setOrders(data.orders));
      }
    } catch (err) {
      console.log("Eroare orders:", err);
    }
  }, [dispatch]);
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);
  const updateStatus = async (id: string, status: string) => {
    try {
      const response = await fetch("https://candle-1.onrender.com/order", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id,
          updates: { status },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const data = await response.json();

      dispatch(alert(data.alert));
      await fetchOrders();
      setTimeout(() => {
        dispatch(closeAlert());
      }, 2000);
    } catch (error) {
      console.error("Update Status Error:", error);
    }
  };
  return (
    <div className="admin-view">
      <div className="calculator">
        <h2 className="calculator__title">Create Product</h2>

        <div className="calculator__form-main">
          <div className="calculator__row-top">
            <input
              type="text"
              placeholder="Product Name"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              className="calculator__input"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="calculator__select"
            >
              <option value="" disabled>
                Selectează categoria
              </option>
              <option value="tablouri">🖼️ Tablouri</option>
              <option value="candele">🕯️ Candele</option>
              <option value="altele">📦 Altele</option>
            </select>

            <div className="calculator__file-box">
              <input
                type="file"
                accept="image/*"
                id="file-upload"
                onChange={(e) =>
                  e.target.files && setSelectedImage(e.target.files[0])
                }
              />
              <label htmlFor="file-upload" className="calculator__file-label">
                {selectedImage ? "✓ Imagine OK" : "📁 Încarcă Foto"}
              </label>
            </div>
          </div>
        </div>

        <div className="calculator__list-header">
          <span>Ingredient</span>
          <span>Preț</span>
          <span>Cantitate</span>
          <span>Total</span>
          <span></span>
        </div>

        <div className="calculator__items-container">
          {items.map((item) => (
            <IngredientsList
              key={item._id}
              item={item}
              items={items}
              setItems={setItems}
            />
          ))}
        </div>

        <button className="calculator__btn-add" onClick={addItem}>
          + Add Item
        </button>

        <div className="calculator__footer">
          <div className="calculator__total-display">
            Total: <span>{total.toFixed(2)} RON</span>
          </div>
          <button onClick={saveList} className="calculator__btn-save">
            Save Product
          </button>
        </div>
      </div>

      {orders && (
        <div className="orders">
          <h2 className="orders__title">Comenzi în Așteptare</h2>
          <div className="orders__grid">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-card__header">
                  <h3>
                    <strong>Email:</strong> {order.email}
                  </h3>
                  <h4>{order.totalPrice.toFixed(2)} RON</h4>
                </div>
                <div className="order-card__items-list">
                  {order.orderItems.map((item) => (
                    <div key={item._id} className="order-card__item">
                      <img src={`${item.image}`} alt={item.name} />
                      <div className="order-card__item-info">
                        <h3>{item.name}</h3>
                        <p>Cantitate: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div>
                  <button
                    className="btn"
                    onClick={() => triggerConfirm(order._id, "Procesare")}
                  >
                    In Procesare
                  </button>
                  <button
                    className="btn"
                    onClick={() => triggerConfirm(order._id, "Finalizata")}
                  >
                    Finalizată
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={showConfirm}
        title={
          pendingAction?.status === "Finalizata"
            ? "Finalizare Comandă"
            : "Procesare Comandă"
        }
        message={
          pendingAction?.status === "Finalizata"
            ? "Sigur dorești să marchezi această comandă ca finalizată?"
            : "Vrei să treci comanda în statusul 'Procesare'?"
        }
        onConfirm={handleModalConfirm}
        onCancel={() => setShowConfirm(false)}
      />
      {alertState.showAlert && <Alert />}
    </div>
  );
};

export default InputsCalculator;
