import { useMutation } from "@apollo/client";
import {
  FormLayout,
  Modal,
  TextField,
  Spinner,
  Select,
} from "@shopify/polaris";
import { isEmpty } from "lodash";
import { useState } from "react";
import { UPDATE_METAFIELDS } from "../shopify/shopify-api";
export default function MetafieldModal({ setActive, id, setMtfData, mtfData }) {
  const [mtfItemData, setMtfItemData] = useState({
    key: "",
    namespace: "",
    type: "single_line_text_field",
    value: "",
    ownerId: id,
  });
  const [errorMessageValue, setErrorMessageValue] = useState("");
  const [errorMessageNamespace, setErrorMessageNamespace] = useState("");
  const [errorMessageKey, setErrorMessageKey] = useState("");
  const [loading, setLoading] = useState(false);
  const handleClose = () => setActive(false);
  const toggleActive = () => setActive((prev) => !prev);

  const [selected, setSelected] = useState("single_line_text_field");

  const handleSelectChange = (v) => {
    setSelected(v);
    setMtfItemData({ ...mtfItemData, type: v });
  };
  const [updateMtf] = useMutation(UPDATE_METAFIELDS);
  const handleSave = async () => {
    if (mtfItemData.key.length < 3) {
      setErrorMessageKey("Key is too short (minimum is 3 characters)");
      if (mtfItemData.namespace.length >= 3) {
        setErrorMessageNamespace("");
      }
    }
    if (mtfItemData.namespace.length < 3) {
      setErrorMessageNamespace(
        "Namespace is too short (minimum is 3 characters)"
      );
      if (mtfItemData.key.length >= 3) {
        setErrorMessageKey("");
      }
    }
    if (mtfItemData.key.length >= 3 && mtfItemData.namespace.length >= 3) {
      setErrorMessageKey("");
      setErrorMessageNamespace("");
      if (mtfItemData.value.length > 0) {
        setLoading(true);
        try {
          const { data } = await updateMtf({
            variables: { metafields: [mtfItemData] },
          });
          if (!isEmpty(data.metafieldsSet?.userErrors)) {
            const err = data.metafieldsSet?.userErrors;
            setErrorMessageValue(
              err.filter((item) => item.field[2] === "value")[0]?.message
            );
          } else {
            setMtfData([data.metafieldsSet.metafields[0], ...mtfData]);
            toggleActive();
          }
          setLoading(false);
        } catch (error) {
          console.log(error);
        }
      } else {
        setErrorMessageValue("Value can't be blank.");
      }
    }
  };
  const handleChange = (key, v) => setMtfItemData({ ...mtfItemData, [key]: v });
  const options = [
    {
      value: "single_line_text_field",
      label: "Single line text",
    },
    {
      value: "multi_line_text_field",
      label: "Muti-line text",
    },
    { value: "color", label: "Color" },
    { value: "json", label: "JSON String" },
  ];

  return (
    <div style={{ height: "500px" }}>
      <Modal
        open={true}
        onClose={handleClose}
        title="Add metafield"
        primaryAction={{
          content: "Add",
          onAction: handleSave,
          loading: loading && <Spinner size="small" />,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: toggleActive,
          },
        ]}
      >
        <Modal.Section>
          <FormLayout>
            <FormLayout.Group>
              <div style={{ display: "flex", width: "100%" }}>
                <div style={{ width: "100%" }}>
                  <Select
                    label="Metafield type"
                    options={options}
                    onChange={(v) => handleSelectChange(v)}
                    value={selected}
                  />
                </div>
              </div>
              <TextField
                label="Namespace"
                type="text"
                error={errorMessageNamespace}
                value={mtfItemData.namespace}
                onChange={(v) => handleChange("namespace", v)}
              />
              <TextField
                label="Key"
                type="text"
                value={mtfItemData.key}
                error={errorMessageKey}
                onChange={(v) => handleChange("key", v)}
              />
              <TextField
                multiline={
                  mtfItemData.type === "multi_line_text_field" ? true : false
                }
                label="Value"
                type="text"
                error={errorMessageValue}
                value={mtfItemData.value}
                onChange={(v) => handleChange("value", v)}
                helpText={
                  mtfItemData.type === "json"
                    ? 'Ex: {"key": "value"}'
                    : mtfItemData.type === "color"
                    ? "Ex: #111111"
                    : mtfItemData.type === ""
                    ? ""
                    : "Ex: Hello"
                }
              />
            </FormLayout.Group>
          </FormLayout>
        </Modal.Section>
      </Modal>
    </div>
  );
}
