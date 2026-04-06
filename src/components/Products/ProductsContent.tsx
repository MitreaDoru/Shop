import ProductCard from "../ProductDetails/ProductCard";
import { useSelector } from "react-redux";
import { selectProducts } from "../../features/actions/actionsSelectors";
import { useNavigate, useParams } from "react-router-dom";
const categories = [
  { id: "products", label: "Toate Produsele" },
  { id: "tablouri", label: "Tablouri" },
  { id: "candele", label: "Candele" },
  { id: "altele", label: "Alte Creații" },
];
function ProductsContent() {
  let products = useSelector(selectProducts);
  const navigate = useNavigate();
  const { category } = useParams();
  if (category !== "products") {
    products = category
      ? products.filter(
          (item) => item.category.toLowerCase() === category.toLowerCase(),
        )
      : products;
  }
  return (
    <div className="shop">
      <aside className="shop__sidebar">
        <h3 className="shop__sidebar-title">Filtre</h3>
        <nav className="shop__filter-nav">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`shop__filter-btn ${category === cat.id ? "shop__filter-btn--active" : ""}`}
              onClick={() => navigate(`/${cat.id}`)}
            >
              <span className="shop__dot"></span>
              {cat.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="shop__products-container">
        {products.map((item) => (
          <ProductCard key={item._id} item={item} />
        ))}
      </div>
    </div>
  );
}
export default ProductsContent;
