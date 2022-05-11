import { useQuery } from "@apollo/client";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { Button, FormLayout, TextStyle } from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import { GET_METAFIELD_PRODUCT_BY_ID } from "../shopify/shopify-api";

const ProductField = ({ id, handleChange }) => {
  const [productItem, setProductItem] = useState({});
  const [openProducts, setOpenProducts] = useState(false);
  const [skip, setSkip] = useState(false);
  const { loading, data } = useQuery(
    GET_METAFIELD_PRODUCT_BY_ID,
    { variables: { id: id } },
    {
      fetchPolicy: "network-only",
      errorPolicy: "all",
      skip,
    }
  );
  useEffect(() => {
    if (data && !loading) {
      setProductItem({
        image: data.product.images.edges[0].node.url,
        title: data.product.title,
        id: data.product.id,
      });
      setSkip(true);
    }
  }, [loading, data]);
  return (
    <>
      <FormLayout>
        <Button
          fullWidth
          onClick={() => {
            setOpenProducts(true);
          }}
        >
          {!loading && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src={productItem?.image}
                alt={productItem?.title}
                height={20}
                width={20}
                style={{ marginRight: "20px" }}
              />
              <TextStyle>{productItem?.title}</TextStyle>
            </div>
          )}
        </Button>
      </FormLayout>
      <ResourcePicker
        resourceType="Product"
        open={openProducts}
        allowMultiple={false}
        showVariants={false}
        onCancel={() => setOpenProducts(false)}
        onSelection={(v) => {
          setOpenProducts(false);
          setProductItem({
            ...productItem,
            image: v.selection[0].images[0].originalSrc,
            title: v.selection[0].title,
          });
          handleChange("value", v.selection[0].id);
        }}
      />
    </>
  );
};

export default ProductField;
