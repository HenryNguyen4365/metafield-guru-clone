import { gql } from "@apollo/client";
export const GET_METAFIELD_PRODUCT_BY_ID = gql`
  query getProductMetafields($id: ID!) {
    product(id: $id) {
      metafields(first: 30) {
        edges {
          node {
            value
            type
            namespace
            key
            id
          }
        }
      }
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
