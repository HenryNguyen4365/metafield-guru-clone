import { useMutation, useQuery } from "@apollo/client";
import {
  Layout,
  Page,
  TextField,
  Card,
  Button,
  Spinner,
} from "@shopify/polaris";
import Table from "../modules/Table";
import { DeleteMajor } from "@shopify/polaris-icons";
import { useEffect, useState } from "react";
import { GET_SHOP_METAFIELD, UPDATE_METAFIELDS } from "../shopify/shopify-api";
import MetafieldModal from "../components/MetafieldModal";
import { isEmpty } from "lodash";
import { navigate } from "@reach/router";
import { getTimer } from "../../utils";
import MultiFields from "../modules/MultiFields";
import DeleteModal from "../components/DeleteModal";
import { useNavigate } from "react-router-dom";
import { History } from "@shopify/app-bridge/actions";

export function Shop({ history }) {
  const [mtfData, setMtfData] = useState([]);
  const [errorMessageValue, setErrorMessageValue] = useState([]);
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeDeleteModal, setActiveDeleteModal] = useState(false);
  const [idDelete, setIdDelete] = useState("");
  const navigateTo = useNavigate();
  const { data, error } = useQuery(GET_SHOP_METAFIELD, {
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });
  useEffect(() => {
    if (data && error == undefined) {
      let inputData = data.shop.metafields.edges.map((item) => ({
        ...item.node,
        time: getTimer(item.node.createdAt),
      }));
      const sortingData = inputData.sort(
        (first, second) => second.time - first.time
      );
      setMtfData(sortingData);
    }
  }, [data]);
  const inputMetafield = mtfData.map((item) => ({
    key: item.key,
    namespace: item.namespace,
    ownerId: data?.shop?.id,
    type: item.type,
    value: item.value,
  }));
  const [updateMtf] = useMutation(UPDATE_METAFIELDS, {
    variables: {
      metafields: inputMetafield,
    },
  });

  const handleChange = (key, v, index) => {
    let metafieldItem = [];
    metafieldItem = [...mtfData];
    metafieldItem[index] = { ...metafieldItem[index], [key]: v };
    setMtfData(metafieldItem);
  };

  const handleSave = async () => {
    setLoading(true);
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
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Page
      fullWidth
      breadcrumbs={[
        {
          onAction: () => {
            navigateTo("/");
            history.dispatch(History.Action.PUSH, `/`);
          },
        },
      ]}
      title="Shop"
    >
      <div style={{ marginBottom: "50px" }}></div>
      <Layout>
        <Layout.Section>
          <Card
            primaryFooterAction={{
              content: "Save",
              onAction: handleSave,
              loading: loading && <Spinner size="small" />,
            }}
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
                {mtfData?.map((item, index) => {
                  return (
                    <tr key={index}>
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
                        <MultiFields
                          mtfItemData={item}
                          index={index}
                          errorMessageValue={
                            errorMessageValue.filter(
                              (item) => Number(item.field[1]) === index
                            )[0]?.message
                          }
                          setMtfData={setMtfData}
                          mtfData={mtfData}
                        />
                      </td>
                      <td>
                        <Button
                          icon={DeleteMajor}
                          onClick={() => {
                            setActiveDeleteModal(true);
                            setIdDelete(item.id);
                          }}
                        ></Button>
                      </td>
                      {activeDeleteModal && (
                        <DeleteModal
                          id={idDelete}
                          mtfData={mtfData}
                          setMtfData={setMtfData}
                          setActiveDeleteModal={setActiveDeleteModal}
                          activeDeleteModal={activeDeleteModal}
                        />
                      )}
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
          id={data?.shop?.id}
          setMtfData={setMtfData}
          mtfData={mtfData}
        />
      )}
    </Page>
  );
}
