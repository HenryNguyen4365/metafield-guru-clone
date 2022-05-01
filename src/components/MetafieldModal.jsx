import { useMutation } from "@apollo/client";
import {
  FormLayout,
  Modal,
  OptionList,
  TextField,
  Popover,
  Button,
} from "@shopify/polaris";
import { isEmpty } from "lodash";
import { useState } from "react";
import { UPDATE_METAFIELDS } from "../shopify/shopify-api";
export default function MetafieldModal({ setActive, id, setMtfData, mtfData }) {
  const [mtfItemData, setMtfItemData] = useState({
    key: "",
    namespace: "",
    type: "",
    value: "",
    ownerId: id,
  });
  const [errorMessageType, setErrorMessageType] = useState([]);
  const [errorMessageNamespace, setErrorMessageNamespace] = useState([]);
  const [errorMessageKey, setErrorMessageKey] = useState([]);
  const [errorMessageValue, setErrorMessageValue] = useState([]);
  const [popoverActive, setPopoverActive] = useState(false);
  const handleClose = () => setActive(false);
  const toggleActive = () => setActive((prev) => !prev);

  const [selected, setSelected] = useState([]);

  const togglePopoverActive = () => setPopoverActive((prev) => !prev);

  const activator = (
    <Button onClick={togglePopoverActive} disclosure>
      Options
    </Button>
  );

  const handleSetMtfType = (v) => {
    setSelected(v);
    setMtfItemData({ ...mtfItemData, type: v[0] });
    setPopoverActive(false);
  };

  const [updateMtf] = useMutation(UPDATE_METAFIELDS);
  const handleSave = async () => {
    try {
      const { data } = await updateMtf({
        variables: { metafields: [mtfItemData] },
      });
      if (!isEmpty(data.metafieldsSet?.userErrors)) {
        const err = data.metafieldsSet?.userErrors;
        setErrorMessageKey(
          (error) => (error = err.filter((item) => item.field[2] === "key"))
        );
        setErrorMessageNamespace(
          (error) =>
            (error = err.filter((item) => item.field[2] === "namespace"))
        );
        setErrorMessageType(
          (error) => (error = err.filter((item) => item.field[2] === "type"))
        );
        setErrorMessageValue(
          (error) => (error = err.filter((item) => item.field[2] === "value"))
        );
      } else {
        setMtfData([...mtfData, data.metafieldsSet.metafields[0]]);
        toggleActive();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleChange = (key, v) => setMtfItemData({ ...mtfItemData, [key]: v });

  return (
    <div style={{ height: "500px" }}>
      <Modal
        open={true}
        onClose={handleClose}
        title="Add metafield"
        primaryAction={{
          content: "Add",
          onAction: handleSave,
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
              <div style={{ display: "flex" }}>
                <TextField
                  disabled={true}
                  label="Type"
                  value={mtfItemData.type}
                  error={errorMessageType.slice(-1)[0]?.message}
                />
                <div style={{ marginTop: "23px" }}>
                  <Popover
                    active={popoverActive}
                    activator={activator}
                    onClose={togglePopoverActive}
                  >
                    <OptionList
                      title="Metafield type"
                      onChange={(v) => handleSetMtfType(v)}
                      options={[
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
                      ]}
                      selected={selected}
                    />
                  </Popover>
                </div>
              </div>

              <TextField
                label="Namespace"
                type="text"
                error={errorMessageNamespace.slice(-1)[0]?.message}
                value={mtfItemData.namespace}
                onChange={(v) => handleChange("namespace", v)}
              />
              <TextField
                label="Key"
                type="text"
                value={mtfItemData.key}
                error={errorMessageKey.slice(-1)[0]?.message}
                onChange={(v) => handleChange("key", v)}
              />
              <TextField
                multiline
                label="Value"
                type="text"
                error={errorMessageValue.slice(-1)[0]?.message}
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
