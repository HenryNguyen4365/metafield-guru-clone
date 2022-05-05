import { Pagination } from "@shopify/polaris";
import { isEmpty } from "lodash";
const PaginationComponent = ({
  inputData,
  getNextProducts,
  getPrevProducts,
  setInputData,
  setLoading,
  queryValue,
}) => {
  return (
    !isEmpty(inputData) && (
      <div
        style={{
          margin: "15px 0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Pagination
          hasPrevious={
            inputData?.products?.pageInfo?.hasPreviousPage ? true : false
          }
          onPrevious={async () => {
            if (inputData?.products?.pageInfo?.hasPreviousPage) {
              setLoading(true);
              let variables = {
                last: 10,
                before: inputData.products.edges[0].cursor,
                query: queryValue ? `title:*${queryValue}*` : "",
              };
              const { data, loading } = await getPrevProducts({
                variables: variables,
              });
              setLoading(loading);
              setInputData(data);
            }
          }}
          hasNext={inputData?.products?.pageInfo?.hasNextPage ? true : false}
          onNext={async () => {
            if (inputData?.products?.pageInfo?.hasNextPage) {
              setLoading(true);
              let variables = {
                first: 10,
                after: inputData.products.edges.slice(-1)[0].cursor,
                query: queryValue ? `title:*${queryValue}*` : "",
              };
              const { data, loading } = await getNextProducts({
                variables: variables,
              });
              setLoading(loading);
              setInputData(data);
            }
          }}
        />
      </div>
    )
  );
};

export default PaginationComponent;
