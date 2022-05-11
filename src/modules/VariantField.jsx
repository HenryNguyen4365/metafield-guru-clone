import { useQuery } from "@apollo/client";
import { ResourcePicker } from "@shopify/app-bridge-react";
import { Button, FormLayout, TextStyle } from "@shopify/polaris";
import React, { useEffect, useState } from "react";
import { GET_VARIANT_BY_ID } from "../shopify/shopify-api";

const VariantField = ({ id, handleChange }) => {
  const [variantItem, setVariantItem] = useState({});
  const [skip, setSkip] = useState(false);
  const [openVariants, setOpenVariants] = useState(false);
  const { loading, data } = useQuery(
    GET_VARIANT_BY_ID,
    { variables: { id: id } },
    {
      fetchPolicy: "network-only",
      errorPolicy: "all",
      skip,
    }
  );

  useEffect(() => {
    if (data && !loading) {
      setVariantItem({
        title: data.productVariant.displayName,
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
            setOpenVariants(true);
          }}
        >
          {!loading && <TextStyle>{variantItem?.title}</TextStyle>}
        </Button>
      </FormLayout>
      <ResourcePicker
        resourceType="ProductVariant"
        open={openVariants}
        allowMultiple={false}
        showVariants={false}
        onCancel={() => setOpenVariants(false)}
        onSelection={(v) => {
          setOpenVariants(false);
          setVariantItem({
            ...variantItem,
            title: v.selection[0].displayName,
          });
          handleChange("value", v.selection[0].id);
        }}
      />
    </>
  );
};

export default VariantField;
