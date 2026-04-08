import { createHashRouter } from "react-router-dom";
import Home from "../../pages/Home";
import HomeContent from "../../components/HomeContent/HomeContent";
import { lazy, Suspense } from "react";
import App from "../../App";

const ProductPage = lazy(() => import("../../pages/Product"));
const Cart = lazy(() => import("../../pages/Cart"));
const Admin = lazy(() => import("../../pages/Admin"));
const ProductsContent = lazy(
  () => import("../../components/Products/ProductsContent"),
);
const OrdersPage = lazy(() => import("../../pages/Orders"));
const AdminRoute = lazy(() => import("../routes/AdminRoute"));

const PageLoader = <div className="loading">Se încarcă pagina...</div>;
export const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
        children: [
          { path: "/", element: <HomeContent /> },
          {
            path: "/product/:id",
            element: (
              <Suspense fallback={PageLoader}>
                <ProductPage />
              </Suspense>
            ),
          },
          {
            path: "/cart",
            element: (
              <Suspense fallback={PageLoader}>
                <Cart />
              </Suspense>
            ),
          },
          {
            path: "/:category",
            element: (
              <Suspense fallback={PageLoader}>
                <ProductsContent />
              </Suspense>
            ),
          },
          {
            path: "/orders",
            element: (
              <Suspense fallback={PageLoader}>
                <OrdersPage />
              </Suspense>
            ),
          },
          {
            element: (
              <Suspense fallback={PageLoader}>
                <AdminRoute />
              </Suspense>
            ),
            children: [
              {
                path: "/admin",
                element: (
                  <Suspense fallback={PageLoader}>
                    <Admin />
                  </Suspense>
                ),
              },
            ],
          },
        ],
      },
    ],
  },
]);
