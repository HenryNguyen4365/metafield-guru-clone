import { Icon, TextField } from "@shopify/polaris";
import { SearchMinor } from "@shopify/polaris-icons";

const Search = ({
  queryValue,
  setQueryValue,
  setInputData,
  getNextProducts,
}) => {
  return (
    <TextField
      value={queryValue}
      placeholder={"Search"}
      prefix={<Icon source={SearchMinor} color="skyDark" />}
      onChange={async (v) => {
        setQueryValue(v);
        const { data } = await getNextProducts({
          variables: { first: 10, query: v ? `title:*${v}*` : "" },
        });
        setInputData(data);
      }}
      clearButton
      onClearButtonClick={async () => {
        setQueryValue("");
        const { data } = await getNextProducts({
          variables: { first: 10, query: "" },
        });
        setInputData(data);
      }}
    />
  );
};

export default Search;
