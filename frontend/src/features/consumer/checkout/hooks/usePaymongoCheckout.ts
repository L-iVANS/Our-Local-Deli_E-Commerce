// import { useMutation } from '@apollo/client/react';
// import { gql } from '@apollo/client';

const INITIATE_PAYMONGO_CHECKOUT = gql`
  mutation InitiatePaymongoCheckout($orderId: Int!) {
    initiatePaymongoCheckout(orderId: $orderId) {
      success
      paymentIntentId
      checkoutUrl
      message
    }
  }
`;

export function usePaymongoCheckout() {
  return useMutation<
    {
      initiatePaymongoCheckout: {
        success: boolean;
        paymentIntentId: string;
        checkoutUrl: string;
        message: string;
      };
    },
    {
      orderId: number;
    }
  >(INITIATE_PAYMONGO_CHECKOUT);
}
