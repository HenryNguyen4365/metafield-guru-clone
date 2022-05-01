import { Router } from "@reach/router";
import Products from "../pages/Products";
import { ProductMetafield } from "../components/ProductMetafield";
import { EmptyStatePage } from "../components/EmptyPage";
export default function ProductsPage() {
  return (
    <Router>
      <Products path="/" />
      <EmptyStatePage path="/" />
      <ProductMetafield path="/:id" />
    </Router>
  );
}
