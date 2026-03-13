import type { IngredientRecived } from "../../types/ingredients";
interface IngredientsListProps {
  item: IngredientRecived;
  items: IngredientRecived[];
  setItems: React.Dispatch<React.SetStateAction<IngredientRecived[]>>;
}
const IngredientsList: React.FC<IngredientsListProps> = ({
  item,
  items,
  setItems,
}) => {
  const removeItem = (id: string) => {
    setItems(items.filter((item) => item._id !== id));
  };

  const updateLabel = (id: string, value: string) => {
    setItems(
      items.map((item) => (item._id === id ? { ...item, label: value } : item)),
    );
  };

  const updateValue = (id: string, value: number) => {
    setItems(
      items.map((item) => (item._id === id ? { ...item, value } : item)),
    );
  };
  const updateMultiplier = (id: string, multiplier: number) => {
    setItems(
      items.map((item) => (item._id === id ? { ...item, multiplier } : item)),
    );
  };
  return (
    <div>
      <div className="row" key={item._id}>
        <input
          className="label"
          placeholder="Name"
          value={item.label}
          onChange={(e) => updateLabel(item._id, e.target.value)}
        />

        <input
          className="value"
          type="number"
          value={item.value}
          onChange={(e) =>
            updateValue(item._id, parseFloat(e.target.value) || 0)
          }
        />

        <input
          className="multiplier"
          type="number"
          value={item.multiplier}
          onChange={(e) =>
            updateMultiplier(item._id, parseFloat(e.target.value) || 0)
          }
        />

        <div className="calculated">
          {(item.value * item.multiplier).toFixed(2)}
        </div>

        <button className="delete" onClick={() => removeItem(item._id)}>
          ✕
        </button>
      </div>
    </div>
  );
};

export default IngredientsList;
