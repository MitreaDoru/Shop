import { RouterProvider, createHashRouter } from "react-router-dom";
import ProductDetails from "./pages/ProductDetails";
import HomeContent from "./components/HomeContent/HomeContent";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Admin from "./pages/Admin";
import { useEffect, useState } from "react";
import { addProduct, ingredients } from "./features/actions/productSlice";
import type { AppDispatch } from "./app/store";
import { useDispatch } from "react-redux";
import AdminRoute from "./app/routes/AdminRoute";
import { loginUser, logoutUser } from "./features/actions/authSlice";
import ProductsContent from "./components/Products/ProductsContent";
import OrdersPage from "./pages/Orders";
import { useAuthCheck } from "./features/actions/useAuthCheck";
const router = createHashRouter([
  {
    path: "/", // Schimbă din "/Candle" în "/" pentru că HashRouter se ocupă singur de bază
    element: <Home />,
    children: [
      { path: "/", element: <HomeContent /> },
      { path: "/product/:id", element: <ProductDetails /> },
      { path: "/cart", element: <Cart /> },
      { path: "/:category", element: <ProductsContent /> },
      { path: "/orders", element: <OrdersPage /> },
      {
        element: <AdminRoute />,
        children: [{ path: "/admin", element: <Admin /> }],
      },
    ],
  },
]);

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);

  useAuthCheck();

  useEffect(() => {
    const initAppData = async () => {
      const token = localStorage.getItem("token");

      try {
        const dataRes = await fetch("https://candle-1-ax6h.onrender.com/data");
        const data = await dataRes.json();
        dispatch(addProduct(data.products));
        dispatch(ingredients(data.ingredients.ingredients));
        if (token && token !== "null") {
          const userRes = await fetch(
            "https://candle-1-ax6h.onrender.com/user",
            {
              headers: { Authorization: `Bearer ${token.replace(/["]/g, "")}` },
            },
          );

          if (userRes.ok) {
            const userData = await userRes.json();
            dispatch(loginUser(userData.user));
          } else {
            dispatch(logoutUser());
          }
        }
      } catch (err) {
        console.error("Initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    initAppData();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="loading">
        <h3>Serverul pornește (host gratuit)... poate dura 15-30 secunde.</h3>
        <h3>Loading......</h3>
      </div>
    );
  }
  return (
    <div className="app">
      {/* 3. Provider-ul rămâne la fel, dar va folosi router-ul de tip Hash */}
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
