import { Router } from "@reach/router";
import Products from "../pages/Products";
import { ProductMetafield } from "../components/ProductMetafield";
export function ProductsPage() {
  return (
    <Router>
      <Products path="/" />
      <ProductMetafield path="/metafields/:id" />
    </Router>
  );
}
