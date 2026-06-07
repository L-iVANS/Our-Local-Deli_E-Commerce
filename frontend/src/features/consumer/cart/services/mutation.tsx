import { gql } from "@apollo/client";

export const PLACE_ORDER = gql`
  mutation PlaceOrder($input: PlaceOrderInput!) {
    placeOrder(input: $input) {
      success
      orderNumber
      message
      orderId
      createdAt
    }
  }
`;
