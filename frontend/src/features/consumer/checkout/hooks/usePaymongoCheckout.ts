// src/features/consumer/checkout/hooks/usePaymongoCheckout.ts

import { useMutation } from '@tanstack/react-query';
import { paymongoService } from '../services/paymongo-service';

interface CheckoutPayload {
  orderId: number;
  amount: number;
  description?: string;
}

export const usePaymongoCheckout = () => {
  return useMutation({
    mutationFn: (payload: CheckoutPayload) =>
      paymongoService.initiateCheckout(payload),
  });
};