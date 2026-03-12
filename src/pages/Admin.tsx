import React, { useState } from "react";
import {
  selectAlert,
  selectIngredients,
} from "../features/actions/actionsSelectors";
import { useDispatch, useSelector } from "react-redux";
import type { Ingredient } from "../types/ingredients";
import type { NewProduct } from "../types/product";
import IngredientsList from "../components/ProductDetails/IngredientsList";
import { alert, closeAlert } from "../features/actions/authSlice";

import type { AppDispatch } from "../app/store";
import Alert from "../components/ProductDetails/Alert";

const InputsCalculator: React.FC = () => {
  const [listName, setListName] = useState("");
  const [items, setItems] = useState<Ingredient[]>(
    useSelector(selectIngredients),
  );
  const dispatch = useDispatch<AppDispatch>();
  const alertState = useSelector(selectAlert);
  const token = localStorage.getItem("token");
  const addItem = () => {
    setItems([
      ...items,
      { _id: String(new Date()), label: "", value: 0, multiplier: 0 },
    ]);
  };

  const total = items.reduce(
    (sum, item) => sum + item.value * item.multiplier,
    0,
  );

  const saveList = async () => {
    if (!listName.trim()) {
      dispatch(
        alert({
          title: "Product Name",
          message: "Please enter a product name.",
        }),
      );
      return;
    }

    const usedItems = items.filter((item) => item.multiplier > 0);

    const product: NewProduct = {
      name: listName,
      items: usedItems,
      ingredients: items,
    };

    try {
      const response = await fetch("https://candle-1.onrender.com/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      const data = await response.json();
      dispatch(alert(data.alert));
      setTimeout(() => {
        dispatch(closeAlert());
      }, 2000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="calculator">
      <h2>Create Product</h2>

      <div className="saveRow">
        <input
          type="text"
          placeholder="Product Name"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
        />

        <button onClick={saveList}>Save Product</button>
      </div>

      {items.map((item) => (
        <IngredientsList
          key={item._id}
          item={item}
          items={items}
          setItems={setItems}
        />
      ))}

      <button className="add" onClick={addItem}>
        Add Item
      </button>

      <div className="total">Total: {total.toFixed(2)}</div>
      {alertState.showAlert && <Alert />}
    </div>
  );
};

export default InputsCalculator;
