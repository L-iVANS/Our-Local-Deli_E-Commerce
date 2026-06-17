import { gql } from "@apollo/client";

export const GET_CART = gql`
  query GetCart {
    getCart {
      items {
        id
        userId
        productId
        quantity
        unitPrice
        selectedColor
        selectedSize
        createdAt
        updatedAt
        product {
          productId
          productName
          imageUrl
          productDescription
          productPrice
          category {
            categoryId
            categoryName
          }
        }
      }
      totalItems
      totalPrice
    }
  }
`;
