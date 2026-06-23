// src/features/public/cart/hooks/useRemoveCartItem.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "../services/cart-service";

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cartItemId: number) => {
      return await cartService.removeItem(cartItemId);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};