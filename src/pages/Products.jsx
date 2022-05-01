import { navigate } from "@reach/router";
import { Page, Layout } from "@shopify/polaris";
import { useState } from "react";
import { EmptyStatePage } from "../components/EmptyPage";
import { ProductMetafield } from "../components/ProductMetafield";

const Products = () => {
  const [selection, setSelection] = useState([]);
  return (
    <Page
      title="Product"
      breadcrumbs={[{ onAction: () => navigate("/") }]}
      fullWidth
    >
      {selection?.length > 0 ? (
        <ProductMetafield productIds={selection[0]} />
      ) : (
        <EmptyStatePage setSelection={setSelection} />
      )}
    </Page>
  );
};

export default Products;
