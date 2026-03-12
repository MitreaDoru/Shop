import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
import { loginUser } from "./features/actions/authSlice";
const router = createBrowserRouter([
  {
    path: "/Candle",
    element: <Home />,
    children: [
      { path: "/Candle", element: <HomeContent /> },
      { path: "/Candle/product/:id", element: <ProductDetails /> },
      { path: "/Candle/cart", element: <Cart /> },

      {
        element: <AdminRoute />,
        children: [{ path: "/Candle/admin", element: <Admin /> }],
      },
    ],
  },
]);

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    fetch("https://candle-uqyt.onrender.com/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((user) => {
        dispatch(loginUser(user.user));
      })
      .catch((err) => {
        console.log(err);
      });
  }, [dispatch]);
  useEffect(() => {
    fetch("https://candle-uqyt.onrender.com/data")
      .then((result) => result.json())
      .then((data) => {
        dispatch(addProduct(data.products));
        dispatch(ingredients(data.ingredients.ingredients));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [dispatch]);

  if (loading) {
    return <div className="content">Loading...</div>;
  }
  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
