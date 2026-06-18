// src/features/consumer/checkout/services/paymongo-service.ts

import { api } from '@/lib/api';

interface CheckoutPayload {
  orderId: number;
  amount: number;
  description?: string;
}

interface CheckoutResponse {
  success: boolean;
  paymentIntentId: string;
  checkoutUrl: string;
  message?: string;
}

export const paymongoService = {
  initiateCheckout: (payload: CheckoutPayload): Promise<CheckoutResponse> => {
    return api.post('paymongo/checkout', { json: payload }).json<CheckoutResponse>();
  },
};