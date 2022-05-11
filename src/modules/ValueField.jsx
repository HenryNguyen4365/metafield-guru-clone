import { useLazyQuery } from "@apollo/client";
import { ResourcePicker } from "@shopify/app-bridge-react";
import {
  Button,
  ButtonGroup,
  ColorPicker,
  FormLayout,
  hsbToHex,
  Popover,
  Select,
  TextField,
  TextStyle,
} from "@shopify/polaris";
import { format, formatISO } from "date-fns";
import { isEmpty } from "lodash";
import { useState } from "react";
import { GET_FILES } from "../shopify/shopify-api";
const ValueField = ({ mtfItemData, errorMessageValue, setMtfItemData }) => {
  const [popoverActive, setPopoverActive] = useState(false);
  const [product, setProduct] = useState({});
  const [variant, setVariant] = useState({});
  const [openProducts, setOpenProducts] = useState(false);
  const [openVariants, setOpenVariants] = useState(false);
  const [openFiles, setOpenFiles] = useState(false);
  const [color, setColor] = useState({
    hue: 120,
    brightness: 1,
    saturation: 1,
  });

  const optionDimensions = [
    { value: "INCHES", label: "in" },
    { value: "FEET", label: "ft" },
    { value: "YARDS", label: "yd" },
    { value: "MILLIMETERS", label: "mm" },
    { value: "CENTIMETERS", label: "cm" },
    { value: "METERS", label: "m" },
  ];
  const optionVolumes = [
    { value: "MILLILITERS", label: "ml" },
    { value: "CENTILITERS", label: "cl" },
    { value: "LITERS", label: "l" },
    { value: "CUBIC_METERS", label: "m3" },
    { value: "FLUID_OUNCES", label: "us_fl_oz" },
    { value: "PINTS", label: "us_pt" },
    { value: "QUARTS", label: "us_qt" },
    { value: "GALLONS", label: "us_gal" },
    { value: "IMPERIAL_FLUID_OUNCES", label: "imp_fl_oz" },
    { value: "IMPERIAL_PINTS", label: "imp_pt" },
    { value: "IMPERIAL_QUARTS", label: "imp_qt" },
    { value: "IMPERIAL_GALLONS", label: "imp_gal" },
  ];
  const optionWeights = [
    { value: "OUNCES", label: "oz" },
    { value: "POUNDS", label: "lb" },
    { value: "GRAMS", label: "g" },
    { value: "KILOGRAMS", label: "kg" },
  ];

  const togglePopoverActive = () => setPopoverActive((prev) => !prev);
  const activator = <Button onClick={togglePopoverActive}>Color</Button>;

  const [getFiles] = useLazyQuery(GET_FILES, {});

  const handleColorChange = (v) => {
    setColor(v);
    setMtfItemData({
      ...mtfItemData,
      value: hsbToHex(v),
    });
  };

  const handleSelectChange = (v) => {
    setMtfItemData({
      ...mtfItemData,
      value: { ...mtfItemData.value, unit: v },
    });
  };

  let inputComponent;

  switch (mtfItemData.type) {
    case "single_line_text_field":
    case "multi_line_text_field":
    case "json":
      inputComponent = (
        <TextField
          multiline={
            mtfItemData.type === "multi_line_text_field" ||
            mtfItemData.type === "json"
              ? true
              : false
          }
          type="text"
          error={errorMessageValue}
          value={mtfItemData.value}
          onChange={(v) => setMtfItemData({ ...mtfItemData, value: v })}
        />
      );
      break;

    case "color":
      inputComponent = (
        <FormLayout>
          <div style={{ display: "flex" }}>
            <div>
              <Popover
                active={popoverActive}
                activator={activator}
                onClose={togglePopoverActive}
              >
                <Popover.Pane fixed>
                  <Popover.Section>
                    <p>Color Picker</p>
                  </Popover.Section>
                </Popover.Pane>
                <ColorPicker
                  onChange={(v) => handleColorChange(v)}
                  color={color}
                />
              </Popover>
            </div>
            <div style={{ width: "100%" }}>
              <TextField value={mtfItemData.value} />
            </div>
          </div>
        </FormLayout>
      );
      break;

    case "boolean":
      inputComponent = (
        <ButtonGroup segmented fullWidth>
          <Button
            pressed={mtfItemData.value === "true" ? true : false}
            onClick={() => setMtfItemData({ ...mtfItemData, value: "true" })}
          >
            True
          </Button>
          <Button
            pressed={mtfItemData.value === "false" ? true : false}
            onClick={() => setMtfItemData({ ...mtfItemData, value: "false" })}
          >
            False
          </Button>
        </ButtonGroup>
      );
      break;

    case "date":
      inputComponent = (
        <TextField
          type="date"
          error={errorMessageValue}
          onChange={(v) => {
            setMtfItemData({ ...mtfItemData, value: v });
          }}
          value={mtfItemData.value}
        />
      );
      break;

    case "dimension":
      inputComponent = (
        <FormLayout>
          <FormLayout.Group condensed>
            <TextField
              error={errorMessageValue}
              type="number"
              onChange={(v) =>
                setMtfItemData({
                  ...mtfItemData,
                  value: { ...mtfItemData.value, value: v },
                })
              }
              value={mtfItemData.value.value}
            />
            <Select
              options={optionDimensions}
              onChange={(v) => handleSelectChange(v)}
              value={mtfItemData.value.unit}
            />
          </FormLayout.Group>
        </FormLayout>
      );
      break;
    case "number_decimal":
      inputComponent = (
        <TextField
          error={errorMessageValue}
          type="number"
          onChange={(v) =>
            setMtfItemData({
              ...mtfItemData,
              value: v,
            })
          }
          value={mtfItemData.value}
        />
      );
      break;
    case "number_integer":
      inputComponent = (
        <TextField
          error={errorMessageValue}
          type="number"
          onChange={(v) =>
            setMtfItemData({
              ...mtfItemData,
              value: v,
            })
          }
          value={mtfItemData.value}
        />
      );
      break;
    case "date_time":
      inputComponent = (
        <TextField
          type="datetime-local"
          onChange={(v) => {
            setMtfItemData({ ...mtfItemData, value: formatISO(new Date(v)) });
          }}
          error={errorMessageValue}
          value={
            mtfItemData.type === "date_time" && mtfItemData.value.length !== 0
              ? format(new Date(mtfItemData.value), "yyyy-MM-dd'T'HH:mm")
              : ""
          }
        />
      );
      break;
    case "rating":
      inputComponent = (
        <FormLayout>
          <TextField
            error={errorMessageValue}
            type="number"
            onChange={(v) =>
              setMtfItemData({
                ...mtfItemData,
                value: { ...mtfItemData.value, value: v },
              })
            }
            value={mtfItemData.value.value}
          />
          <FormLayout.Group condensed>
            <TextField
              placeholder="Min"
              type="number"
              onChange={(v) =>
                setMtfItemData({
                  ...mtfItemData,
                  value: { ...mtfItemData.value, scale_min: v },
                })
              }
              value={mtfItemData.value.scale_min}
            />
            <TextField
              placeholder="Max"
              type="number"
              onChange={(v) =>
                setMtfItemData({
                  ...mtfItemData,
                  value: { ...mtfItemData.value, scale_max: v },
                })
              }
              value={mtfItemData.value.scale_max}
            />
          </FormLayout.Group>
        </FormLayout>
      );
      break;
    case "product_reference":
      inputComponent = (
        <>
          <FormLayout>
            <Button fullWidth onClick={() => setOpenProducts(true)}>
              {isEmpty(product) ? (
                "Add product"
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={product.image}
                    alt={product.title}
                    height={20}
                    width={20}
                    style={{ marginRight: "20px" }}
                  />
                  <TextStyle>{product.title}</TextStyle>
                </div>
              )}
            </Button>
          </FormLayout>
          <ResourcePicker
            resourceType="Product"
            allowMultiple={false}
            showVariants={false}
            open={openProducts}
            onCancel={() => setOpenProducts(false)}
            onSelection={(v) => {
              setOpenProducts(false);
              setProduct({
                ...product,
                image: v.selection[0].images[0].originalSrc,
                title: v.selection[0].title,
              });
              setMtfItemData({ ...mtfItemData, value: v.selection[0].id });
            }}
          />
        </>
      );
      break;
    case "variant_reference":
      inputComponent = (
        <>
          <FormLayout>
            <Button fullWidth onClick={() => setOpenVariants(true)}>
              {isEmpty(variant) ? (
                "Add variant"
              ) : (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TextStyle>{variant.title}</TextStyle>
                </div>
              )}
            </Button>
          </FormLayout>
          <ResourcePicker
            resourceType="ProductVariant"
            allowMultiple={false}
            showVariants={false}
            open={openVariants}
            onCancel={() => setOpenVariants(false)}
            onSelection={(v) => {
              setOpenVariants(false);
              setVariant({ ...product, title: v.selection[0].displayName });
              setMtfItemData({ ...mtfItemData, value: v.selection[0].id });
            }}
          />
        </>
      );
      break;
    case "volume":
      inputComponent = (
        <FormLayout>
          <FormLayout.Group condensed>
            <TextField
              error={errorMessageValue}
              type="number"
              onChange={(v) =>
                setMtfItemData({
                  ...mtfItemData,
                  value: { ...mtfItemData.value, value: v },
                })
              }
              value={mtfItemData.value.value}
            />
            <Select
              options={optionVolumes}
              onChange={(v) => handleSelectChange(v)}
              value={mtfItemData.value.unit}
            />
          </FormLayout.Group>
        </FormLayout>
      );
      break;
    case "weight":
      inputComponent = (
        <FormLayout>
          <FormLayout.Group condensed>
            <TextField
              error={errorMessageValue}
              type="number"
              onChange={(v) =>
                setMtfItemData({
                  ...mtfItemData,
                  value: { ...mtfItemData.value, value: v },
                })
              }
              value={mtfItemData.value.value}
            />
            <Select
              options={optionWeights}
              onChange={(v) => handleSelectChange(v)}
              value={mtfItemData.value.unit}
            />
          </FormLayout.Group>
        </FormLayout>
      );
      break;
    case "file_reference":
      inputComponent = (
        <>
          <FormLayout>
            <Button
              fullWidth
              onClick={async () => {
                const { data, error } = await getFiles();
                console.log(data, error);
              }}
            ></Button>
          </FormLayout>
        </>
      );
      break;
    default:
      break;
  }
  return inputComponent;
};

export default ValueField;
