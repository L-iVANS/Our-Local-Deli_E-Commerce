import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts {
    getProducts {
      productId
      productName
      productDescription
      sku
      categoryId
      imageUrl
      category {
        categoryId
        categoryName
        slug
      }
      productPrice
      reorderPoint
      available
      blocked
      inTransit
      createdAt
      updatedAt
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($productId: Int!) {
    getProductById(productId: $productId) {
      productId
      productName
      productDescription
      sku
      categoryId
      imageUrl
      category {
        categoryId
        categoryName
        slug
      }
      productPrice
      reorderPoint
      available
      inTransit
      blocked
      createdAt
      updatedAt
    }
  }
`;

export const GET_PRODUCT_BY_NAME = gql`
  query GetProductByName($productName: String!) {
    getProductByName(productName: $productName) {
      productId
      productName
      productDescription
      sku
      categoryId
      imageUrl
      category {
        categoryId
        categoryName
        slug
      }
      productPrice
      reorderPoint
      available
      inTransit
      blocked
      createdAt
      updatedAt
    }
  }
`;
