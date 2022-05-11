import HomePage from "../pages/HomePage";
import ProductsPage from "../pages/Products";
import { Shop } from "../pages/Shop";
import { ProductMetafield } from "../components/ProductMetafield";
import { Routes, Route } from "react-router-dom";
import { useAppBridge } from "@shopify/app-bridge-react";
import { History } from "@shopify/app-bridge/actions";
const AppRoute = () => {
  const app = useAppBridge();

  const history = History.create(app);
  return (
    <Routes>
      <Route path="/" element={<HomePage history={history} />} />
      <Route path="products" element={<ProductsPage history={history} />} />
      <Route
        path="products/metafields/:id"
        element={<ProductMetafield history={history} />}
      />
      <Route path="shop" element={<Shop history={history} />} />
    </Routes>
  );
};

export default AppRoute;
