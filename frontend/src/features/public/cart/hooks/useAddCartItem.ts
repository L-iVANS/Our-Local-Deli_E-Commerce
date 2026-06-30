// src/features/public/cart/hooks/useAddCartItem.ts

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "../services/cart-service";

export const useAddCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      productId,
      quantity,
      selectedColor,
      selectedSize,
    }: {
      productId: number;
      quantity: number;
      selectedColor?: string;
      selectedSize?: string;
    }) => {
      return await cartService.addToCart({
        productId,
        quantity,
        selectedColor,
        selectedSize,
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
};