import { useMutation } from "@apollo/client";
import {
  FormLayout,
  Modal,
  TextField,
  Spinner,
  Select,
  TextStyle,
} from "@shopify/polaris";
import { format, formatISO } from "date-fns";
import { isEmpty } from "lodash";
import { useState } from "react";
import ValueField from "../modules/ValueField";
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
    if (
      v === "single_line_text_field" ||
      v === "multi_line_text_field" ||
      v === "json"
    )
      setMtfItemData({ ...mtfItemData, value: "", type: v });
    if (v === "boolean")
      setMtfItemData({ ...mtfItemData, value: "true", type: v });
    if (v === "date")
      setMtfItemData({
        ...mtfItemData,
        value: format(new Date(), "yyyy-MM-dd"),
        type: v,
      });
    if (v === "dimension")
      setMtfItemData({
        ...mtfItemData,
        value: { value: "1", unit: "in" },
        type: v,
      });
    if (v === "color")
      setMtfItemData({ ...mtfItemData, value: "#000000", type: v });
    if (v === "number_decimal")
      setMtfItemData({ ...mtfItemData, value: "1.1", type: v });
    if (v === "number_integer")
      setMtfItemData({ ...mtfItemData, value: "1", type: v });
    if (v === "date_time")
      setMtfItemData({ ...mtfItemData, value: formatISO(new Date()), type: v });
    if (v === "rating")
      setMtfItemData({
        ...mtfItemData,
        value: { value: 1, scale_min: 0, scale_max: 5 },
        type: v,
      });
    if (v === "product_reference")
      setMtfItemData({ ...mtfItemData, value: "", type: v });
    if (v === "variant_reference")
      setMtfItemData({ ...mtfItemData, value: "", type: v });
    if (v === "volume")
      setMtfItemData({
        ...mtfItemData,
        value: { value: "1", unit: "ml" },
        type: v,
      });
    if (v === "weight")
      setMtfItemData({
        ...mtfItemData,
        value: { value: "1", unit: "oz" },
        type: v,
      });
    if (v === "file_reference")
      setMtfItemData({ ...mtfItemData, value: "", type: v });
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
      if (
        mtfItemData.value.length > 0 ||
        Object.entries(mtfItemData.value).length > 0
      ) {
        setLoading(true);
        try {
          const { data } = await updateMtf({
            variables: {
              metafields: [
                mtfItemData.type === "dimension" ||
                mtfItemData.type === "rating" ||
                mtfItemData.type === "weight" ||
                mtfItemData.type === "volume"
                  ? { ...mtfItemData, value: JSON.stringify(mtfItemData.value) }
                  : mtfItemData,
              ],
            },
          });
          if (!isEmpty(data.metafieldsSet?.userErrors)) {
            const err = data.metafieldsSet?.userErrors;
            setErrorMessageValue(
              err.filter((item) => item.field[2] === "value")[0]?.message
            );
          } else {
            setMtfData([data.metafieldsSet.metafields[0], ...mtfData]);
            setMtfItemData({
              ...mtfItemData,
              value: "",
              key: "",
              namespace: "",
            });
            toggleActive();
          }
          setLoading(false);
        } catch (error) {
          console.log(error);
          setLoading(false);
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
    { value: "boolean", label: "Boolean" },
    { value: "date", label: "Date" },
    { value: "dimension", label: "Dimension" },
    { value: "number_decimal", label: "Decimal" },
    { value: "number_integer", label: "Integer" },
    { value: "date_time", label: "Date Time" },
    { value: "rating", label: "Rating" },
    { value: "product_reference", label: "Product" },
    { value: "variant_reference", label: "Variant" },
    { value: "volume", label: "Volumn" },
    { value: "weight", label: "Weight" },
    { value: "file_reference", label: "File" },
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
                  <TextStyle>Type</TextStyle>
                  <Select
                    options={options}
                    onChange={(v) => handleSelectChange(v)}
                    value={selected}
                  />
                </div>
              </div>
              <div>
                <TextStyle>Namespace</TextStyle>
                <TextField
                  type="text"
                  error={errorMessageNamespace}
                  value={mtfItemData.namespace}
                  onChange={(v) => handleChange("namespace", v)}
                />
              </div>
              <div>
                <TextStyle>Key</TextStyle>
                <TextField
                  type="text"
                  value={mtfItemData.key}
                  error={errorMessageKey}
                  onChange={(v) => handleChange("key", v)}
                />
              </div>
              <div>
                <TextStyle>Value</TextStyle>
                <ValueField
                  mtfItemData={mtfItemData}
                  errorMessageValue={errorMessageValue}
                  setMtfItemData={setMtfItemData}
                />
              </div>
            </FormLayout.Group>
          </FormLayout>
        </Modal.Section>
      </Modal>
    </div>
  );
}
