import { gql } from "@apollo/client";
export const GET_METAFIELD_PRODUCT_BY_ID = gql`
  query getProductMetafields($id: ID!) {
    product(id: $id) {
      images(first: 5) {
        edges {
          node {
            url
          }
        }
      }
      id
      title
      metafields(first: 30) {
        edges {
          node {
            value
            type
            namespace
            key
            updatedAt
            id
            createdAt
          }
        }
      }
    }
  }
`;

export const GET_VARIANT_BY_ID = gql`
  query getVariant($id: ID!) {
    productVariant(id: $id) {
      displayName
    }
  }
`;

export const UPDATE_METAFIELDS = gql`
  mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        key
        namespace
        value
        id
        type
      }
      userErrors {
        field
        message
        code
      }
    }
  }
`;

export const DELETE_METAFIELD = gql`
  mutation metafieldDelete($input: MetafieldDeleteInput!) {
    metafieldDelete(input: $input) {
      deletedId
      userErrors {
        field
        message
      }
    }
  }
`;

export const GET_PRODUCTS_BY_ID = gql`
  query getProducts($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on Product {
        title
        handle
        descriptionHtml
        id
        images(first: 1) {
          edges {
            node {
              id
              originalSrc
              altText
            }
          }
        }
        variants(first: 1) {
          edges {
            node {
              price
              id
            }
          }
        }
      }
    }
  }
`;

export const GET_SHOP_METAFIELD = gql`
  query getShopMetafields {
    shop {
      id
      metafields(first: 20) {
        edges {
          node {
            namespace
            key
            value
            type
            id
            updatedAt
            createdAt
          }
        }
      }
    }
  }
`;

export const GET_COLLECTION_LIST = gql`
  query getCollection {
    collections(first: 10) {
      edges {
        node {
          handle
          id
          description
        }
      }
    }
  }
`;

export const GET_NEXT_PRODUCTS = gql`
  query queryProducts($first: Int, $after: String, $query: String) {
    products(first: $first, after: $after, query: $query) {
      edges {
        node {
          metafields(first: 20) {
            edges {
              node {
                value
              }
            }
          }
          id
          title
          featuredImage {
            originalSrc
          }
          handle
          onlineStoreUrl
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_PREV_PRODUCTS = gql`
  query queryProducts($last: Int, $before: String, $query: String) {
    products(last: $last, before: $before, query: $query) {
      edges {
        node {
          metafields(first: 20) {
            edges {
              node {
                value
              }
            }
          }
          id
          title
          featuredImage {
            originalSrc
          }
          handle
          onlineStoreUrl
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }
  }
`;

export const GET_FILES = gql`
  query getFiles {
    files(first: 3) {
      edges {
        node {
          createdAt
          alt
          ... on GenericFile {
            id
            originalFileSize
            url
          }
          ... on MediaImage {
            id
            image {
              id
              originalSrc: url
              width
              height
            }
          }
          ... on Video {
            id
            duration
            preview {
              status
              image {
                id
                width
                height
                url
              }
            }
            originalSource {
              url
              width
              height
              format
              mimeType
            }
            sources {
              url
              width
              height
              format
              mimeType
            }
          }
        }
      }
    }
  }
`;
