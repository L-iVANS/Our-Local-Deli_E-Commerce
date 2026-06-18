// src/features/public/cart/hooks/use-placeorder.ts

import { useMutation } from '@tanstack/react-query';
import { placeOrderService, PlaceOrderPayload } from '../services/mutation';

export const usePlaceOrder = () => {
  return useMutation({
    mutationFn: (payload: PlaceOrderPayload) =>
      placeOrderService.placeOrder(payload),
  });
};