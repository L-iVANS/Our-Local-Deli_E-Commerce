import { gql } from "@apollo/client";

export const ADD_TO_CART = gql`
  mutation AddToCart($input: AddToCartInput!) {
    addToCart(input: $input) {
      id
      userId
      productId
      quantity
      unitPrice
      selectedColor
      selectedSize
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_CART_ITEM = gql`
  mutation UpdateCartItem($input: UpdateCartItemInput!) {
    updateCartItem(input: $input) {
      id
      quantity
      updatedAt
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($itemId: Int!) {
    removeFromCart(itemId: $itemId)
  }
`;

export const CLEAR_CART = gql`
  mutation ClearCart {
    clearCart
  }
`;

export const REMOVE_CART_ITEM_BY_PRODUCT_ID = gql`
  mutation RemoveCartItemByProductId($productId: Int!) {
    removeCartItemByProductId(productId: $productId)
  }
`;
