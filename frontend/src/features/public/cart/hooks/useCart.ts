// src/features/public/cart/hooks/useCart.ts
import { useQuery } from "@tanstack/react-query";
import { cartService } from "../services/cart-service"; // ✅ adjust path if needed

export const useCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      return await cartService.getCart(); // ✅ mapper runs inside, returns frontend shape
    },
  });
};