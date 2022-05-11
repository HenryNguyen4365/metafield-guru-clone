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
import { useState } from "react";
import ProductField from "./ProductField";
import VariantField from "./VariantField";

const MultiFields = ({
  mtfItemData,
  errorMessageValue,
  setMtfData,
  index,
  mtfData,
}) => {
  const [popoverActive, setPopoverActive] = useState(false);
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

  const handleChange = (key, v) => {
    let metafieldItem = [];
    metafieldItem = [...mtfData];
    if (metafieldItem[index].type === "color")
      metafieldItem[index] = { ...metafieldItem[index], [key]: hsbToHex(v) };
    else metafieldItem[index] = { ...metafieldItem[index], [key]: v };
    setMtfData(metafieldItem);
  };
  const handleJSONValueChange = (key, v) => {
    let metafieldItem = [];
    metafieldItem = [...mtfData];
    let valueToJSON = JSON.parse(metafieldItem[index].value);
    valueToJSON = { ...valueToJSON, [key]: v };
    metafieldItem[index] = {
      ...metafieldItem[index],
      value: JSON.stringify(valueToJSON),
    };
    setMtfData(metafieldItem);
  };

  const handleRatingChange = (key, v) => {
    let metafieldItem = [];
    metafieldItem = [...mtfData];
    let valueToJSON = JSON.parse(metafieldItem[index].value);
    valueToJSON = { ...valueToJSON, [key]: v };
    metafieldItem[index] = {
      ...metafieldItem[index],
      value: JSON.stringify(valueToJSON),
    };
    setMtfData(metafieldItem);
  };
  if (mtfItemData.type === "dimension")
    console.log(JSON.parse(mtfItemData.value).unit);

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
          onChange={(v) => handleChange("value", v)}
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
                  onChange={(v) => {
                    setColor(v);
                    handleChange("value", v);
                  }}
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
            onClick={(v) => handleChange("value", "true")}
          >
            True
          </Button>
          <Button
            pressed={mtfItemData.value === "false" ? true : false}
            onClick={() => handleChange("value", "false")}
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
          onChange={(v) => handleChange("value", v)}
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
              onChange={(v) => handleJSONValueChange("value", v)}
              value={JSON.parse(mtfItemData.value).value.toString()}
            />
            <Select
              options={optionDimensions}
              onChange={(v) => handleJSONValueChange("unit", v)}
              value={JSON.parse(mtfItemData.value).unit}
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
          onChange={(v) => handleChange("value", v)}
          value={mtfItemData.value}
        />
      );
      break;
    case "number_integer":
      inputComponent = (
        <TextField
          error={errorMessageValue}
          type="number"
          onChange={(v) => handleChange("value", v)}
          value={mtfItemData.value}
        />
      );
      break;
    case "date_time":
      inputComponent = (
        <TextField
          type="datetime-local"
          onChange={(v) => handleChange("value", formatISO(new Date(v)))}
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
          <FormLayout.Group condensed>
            <TextField
              error={errorMessageValue}
              type="number"
              onChange={(v) => handleRatingChange("value", v)}
              value={JSON.parse(mtfItemData.value).value}
            />
            <TextField
              placeholder="Min"
              type="number"
              onChange={(v) => handleRatingChange("scale_min", v)}
              value={JSON.parse(mtfItemData.value).scale_min}
            />
            <TextField
              placeholder="Max"
              type="number"
              onChange={(v) => handleRatingChange("scale_max", v)}
              value={JSON.parse(mtfItemData.value).scale_max}
            />
          </FormLayout.Group>
        </FormLayout>
      );
      break;
    case "product_reference":
      inputComponent = (
        <ProductField id={mtfItemData.value} handleChange={handleChange} />
      );
      break;
    case "variant_reference":
      inputComponent = (
        <VariantField id={mtfItemData.value} handleChange={handleChange} />
      );
      break;
    case "volume":
      inputComponent = (
        <FormLayout>
          <FormLayout.Group condensed>
            <TextField
              error={errorMessageValue}
              type="number"
              onChange={(v) => handleJSONValueChange("value", v)}
              value={JSON.parse(mtfItemData.value).value.toString()}
            />
            <Select
              options={optionVolumes}
              onChange={(v) => handleJSONValueChange("unit", v)}
              value={JSON.parse(mtfItemData.value).unit}
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
              onChange={(v) => handleJSONValueChange("value", v)}
              value={JSON.parse(mtfItemData.value).value.toString()}
            />
            <Select
              options={optionWeights}
              onChange={(v) => handleJSONValueChange("unit", v)}
              value={JSON.parse(mtfItemData.value).unit}
            />
          </FormLayout.Group>
        </FormLayout>
      );
      break;
    default:
      inputComponent = (
        <TextField
          error={errorMessageValue}
          onChange={(v) => handleChange("value", v)}
          value={mtfItemData.value}
        />
      );
      break;
  }
  return inputComponent;
};

export default MultiFields;
