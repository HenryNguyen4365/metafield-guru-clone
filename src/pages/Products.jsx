import { useLazyQuery } from "@apollo/client";
import { navigate } from "@reach/router";
import { Page, Layout, Card } from "@shopify/polaris";
import { useEffect, useState } from "react";
import { ProductsList } from "../components/ProductList";
import { GET_NEXT_PRODUCTS, GET_PREV_PRODUCTS } from "../shopify/shopify-api";
import Pagination from "../components/Pagination";
const Products = () => {
  const [inputData, setInputData] = useState({});
  const [queryValue, setQueryValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [getNextProducts] = useLazyQuery(GET_NEXT_PRODUCTS, {
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });
  const [getPrevProducts] = useLazyQuery(GET_PREV_PRODUCTS, {
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });
  useEffect(() => {
    setLoading(true);
    const getData = async () => {
      const { data } = await getNextProducts({
        variables: { first: 10, query: "" },
      });
      setLoading(loading);
      setInputData(data);
    };
    getData();
  }, []);
  return (
    <Page
      title="Products"
      breadcrumbs={[{ onAction: () => navigate("/") }]}
      fullWidth
    >
      <Layout>
        <Layout.Section>
          <Card>
            {inputData && (
              <ProductsList
                data={inputData}
                setQueryValue={setQueryValue}
                queryValue={queryValue}
                getNextProducts={getNextProducts}
                setInputData={setInputData}
                loading={loading}
              />
            )}
          </Card>
        </Layout.Section>
      </Layout>
      <Pagination
        inputData={inputData}
        getNextProducts={getNextProducts}
        getPrevProducts={getPrevProducts}
        setLoading={setLoading}
        setInputData={setInputData}
        queryValue={queryValue}
      />
    </Page>
  );
};

export default Products;
