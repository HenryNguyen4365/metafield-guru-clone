import { navigate } from "@reach/router";
import {
  ResourceList,
  TextStyle,
  Stack,
  Thumbnail,
  Badge,
} from "@shopify/polaris";
import ScreenLoading from "./ScreenLoading";
import Search from "./Search";
export function ProductsList({
  data,
  setQueryValue,
  queryValue,
  getNextProducts,
  setInputData,
  loading,
}) {
  const inputData = data?.products?.edges?.map((item) => item.node);
  return (
    <>
      <Search
        queryValue={queryValue}
        setQueryValue={setQueryValue}
        getNextProducts={getNextProducts}
        setInputData={setInputData}
      />
      {loading ? (
        <ScreenLoading />
      ) : (
        <ResourceList
          showHeader
          resourceName={{ singular: "Product", plural: "Products" }}
          items={inputData ? inputData : []}
          renderItem={(item) => {
            const media = item && (
              <Thumbnail
                source={
                  item?.featuredImage?.originalSrc
                    ? item?.featuredImage?.originalSrc
                    : ""
                }
                alt={item?.handle ? item?.handle : ""}
              />
            );
            return (
              <ResourceList.Item
                id={item?.id}
                media={media}
                accessibilityLabel={`View details for ${item?.title}`}
                onClick={() =>
                  navigate(
                    `/products/metafields/${item?.id.replace(
                      "gid://shopify/Product/",
                      ""
                    )}`
                  )
                }
              >
                <Stack>
                  <Stack.Item fill>
                    <h3>
                      <TextStyle variation="strong">{item.title}</TextStyle>
                    </h3>
                  </Stack.Item>
                  <Stack.Item>
                    <Badge
                      status={
                        item?.metafields?.edges?.length > 0
                          ? "success"
                          : "critical"
                      }
                    >
                      {item?.metafields?.edges?.length} metafield(s)
                    </Badge>
                  </Stack.Item>
                </Stack>
              </ResourceList.Item>
            );
          }}
        />
      )}
    </>
  );
}
