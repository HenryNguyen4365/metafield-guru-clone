import { Icon, TextField } from "@shopify/polaris";
import { SearchMinor } from "@shopify/polaris-icons";
import { useCallback } from "react";
import { debounce } from "lodash";
const Search = ({
  queryValue,
  setQueryValue,
  setInputData,
  getNextProducts,
  setLoading,
}) => {
  const handleSearch = debounce(async (v) => {
    setLoading(true);
    const { data, loading } = await getNextProducts({
      variables: { first: 10, query: v ? `title:*${v}*` : "" },
    });
    setLoading(loading);
    setInputData(data);
  }, 500);

  const handleQuerySearch = useCallback((v) => {
    setQueryValue(v);
    handleSearch(v);
  }, []);

  return (
    <TextField
      value={queryValue}
      placeholder={"Search"}
      prefix={<Icon source={SearchMinor} color="skyDark" />}
      onChange={handleQuerySearch}
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
