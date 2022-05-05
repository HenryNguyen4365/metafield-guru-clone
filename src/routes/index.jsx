import { Router } from "@reach/router";
import HomePage from "../pages/HomePage";
import { ProductsPage } from "./Products";
import { Shop } from "../pages/Shop";

const AppRoute = () => (
  <Router>
    <HomePage path="/" />
    <ProductsPage path="/products/*" />
    <Shop path="/shop" />
  </Router>
);

export default AppRoute;
