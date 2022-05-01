import { Router } from "@reach/router";
import HomePage from "../pages/HomePage";
import Products from "./Products";
import { Shop } from "../pages/Shop";

const AppRoute = () => (
  <Router>
    <HomePage path="/" />
    <Products path="/products/*" />
    <Shop path="/shop/*" />
  </Router>
);

export default AppRoute;
