import { useMutation, useQuery } from "@apollo/client";
import {
  Layout,
  TextField,
  Card,
  Button,
  Spinner,
  Page,
} from "@shopify/polaris";
import Table from "../modules/Table";
import { DeleteMajor } from "@shopify/polaris-icons";
import { useEffect, useState } from "react";
import MetafieldModal from "./MetafieldModal";
import {
  GET_METAFIELD_PRODUCT_BY_ID,
  UPDATE_METAFIELDS,
} from "../shopify/shopify-api";
import { isEmpty } from "lodash";
import { getTimer } from "../../utils";
import MultiFields from "../modules/MultiFields";
import DeleteModal from "./DeleteModal";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { ResourcePicker, useAppBridge } from "@shopify/app-bridge-react";
import { History } from "@shopify/app-bridge/actions";
export function ProductMetafield() {
  const app = useAppBridge();
  const history = History.create(app);
  const { id } = useParams();
  const productIds = "gid://shopify/Product/" + id;
  const [mtfData, setMtfData] = useState([]);
  const [products, setProducts] = useState([]);
  const [errorMessageValue, setErrorMessageValue] = useState([]);
  const [active, setActive] = useState(false);
  const [idDelete, setIdDelete] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeDeleteModal, setActiveDeleteModal] = useState(false);
  const navigateTo = useNavigate();
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
    ownerId: productIds,
    type: item.type,
    value: item.value,
  }));
  console.log(inputMetafield);
  const [updateMtf, { error }] = useMutation(UPDATE_METAFIELDS, {
    variables: {
      metafields: inputMetafield,
    },
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data } = await updateMtf();
      console.log(data);
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
            navigateTo("/products");
            history.dispatch(History.Action.PUSH, `/products`);
          },
        },
      ]}
      title={data?.product?.title}
    >
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
                        <TextField value={item.type} disabled />
                      </td>
                      <td>
                        <TextField value={item.namespace} disabled />
                      </td>
                      <td>
                        <TextField value={item.key} disabled />
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
                          products={products}
                          setProducts={setProducts}
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
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            {activeDeleteModal && (
              <DeleteModal
                id={idDelete}
                mtfData={mtfData}
                setMtfData={setMtfData}
                setActiveDeleteModal={setActiveDeleteModal}
                activeDeleteModal={activeDeleteModal}
              />
            )}
          </Card>
        </Layout.Section>
      </Layout>
      {active && (
        <MetafieldModal
          setActive={setActive}
          id={productIds}
          setMtfData={setMtfData}
          mtfData={mtfData}
          setProducts={setProducts}
        />
      )}
    </Page>
  );
}
