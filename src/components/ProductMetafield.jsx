import { useMutation, useQuery } from "@apollo/client";
import { Layout, Page, TextField, Card, Button } from "@shopify/polaris";
import Table from "../modules/Table";
import { DeleteMajor } from "@shopify/polaris-icons";
import { useEffect, useState } from "react";
import MetafieldModal from "./MetafieldModal";
import {
  GET_METAFIELD_PRODUCT_BY_ID,
  UPDATE_METAFIELDS,
  DELETE_METAFIELD,
} from "../shopify/shopify-api";

import { isEmpty } from "lodash";
export function ProductMetafield({ productIds }) {
  const [mtfData, setMtfData] = useState([]);
  const [errorMessageValue, setErrorMessageValue] = useState([]);
  const [active, setActive] = useState(false);
  const { data } = useQuery(GET_METAFIELD_PRODUCT_BY_ID, {
    variables: {
      id: productIds,
    },
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });
  useEffect(() => {
    if (data) {
      let inputData = data.product.metafields.edges.map((item) => ({
        ...item.node,
      }));
      setMtfData(inputData);
    }
  }, [data]);
  const inputMetafield = mtfData.map((item) => ({
    key: item.key,
    namespace: item.namespace,
    ownerId: productIds,
    type: item.type,
    value: item.value,
  }));

  const [updateMtf, { loading, error }] = useMutation(UPDATE_METAFIELDS, {
    variables: {
      metafields: inputMetafield,
    },
  });

  const [deleteMtf] = useMutation(DELETE_METAFIELD);

  const handleChange = (key, v, index) => {
    let metafieldItem = [];
    metafieldItem = [...mtfData];
    metafieldItem[index] = { ...metafieldItem[index], [key]: v };
    setMtfData(metafieldItem);
  };

  const handleSave = async () => {
    try {
      const { data } = await updateMtf();
      if (!isEmpty(data.metafieldsSet?.userErrors)) {
        const err = data.metafieldsSet?.userErrors;
        setErrorMessageValue(
          (error) => (error = err.filter((item) => item.field[2] === "value"))
        );
      } else {
        setErrorMessageValue([]);
        setMtfData(data.metafieldsSet.metafields);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = (_id) => {
    deleteMtf({
      variables: { input: { id: _id } },
    });
    const filterData = mtfData.filter((val) => val.id !== _id);
    setMtfData(filterData);
  };
  return (
    <>
      <Layout>
        <Layout.Section>
          <Card
            primaryFooterAction={{ content: "Save", onAction: handleSave }}
            actions={[
              {
                content: "Add metafield",
                onAction: () => setActive((prev) => !prev),
              },
            ]}
          >
            <Table>
              <thead>
                <tr>
                  <th width={"10%"}>Type</th>
                  <th width={"15%"}>Namespace</th>
                  <th width={"25%"}>Key</th>
                  <th width={"40%"}>Value</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {mtfData?.map((item, key) => {
                  return (
                    <tr key={key}>
                      <td>
                        <TextField
                          value={item.type}
                          onChange={(v) => handleChange("type", v, key)}
                          disabled
                        />
                      </td>
                      <td>
                        <TextField
                          value={item.namespace}
                          onChange={(v) => handleChange("namespace", v, key)}
                          disabled
                        />
                      </td>
                      <td>
                        <TextField
                          value={item.key}
                          onChange={(v) => handleChange("key", v, key)}
                          disabled
                        />
                      </td>
                      <td>
                        <TextField
                          multiline
                          value={item.value}
                          onChange={(v) => handleChange("value", v, key)}
                          error={
                            errorMessageValue.filter(
                              (item) => Number(item.field[1]) === key
                            )[0]?.message
                          }
                        />
                      </td>
                      <td>
                        <Button
                          icon={DeleteMajor}
                          onClick={() => handleDelete(item.id)}
                        ></Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Card>
        </Layout.Section>
      </Layout>
      {active && (
        <MetafieldModal
          setActive={setActive}
          id={productIds}
          setMtfData={setMtfData}
          mtfData={mtfData}
        />
      )}
    </>
  );
}
