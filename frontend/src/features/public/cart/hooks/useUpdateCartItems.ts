// src/features/public/cart/hooks/useUpdateCartItems.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "../services/cart-service";

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      quantity,
    }: {
      id: number;       // ✅ cart row id (not productId)
      quantity: number;
    }) => {
      return await cartService.updateQty(id, quantity);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};