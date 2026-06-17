import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { CartItem, CartResponse } from "../types/index";

export const useCart = () => {
  return useQuery<CartResponse>({
    queryKey: ["cart"],
    queryFn: async () => {
      return api.get("cart").json<CartResponse>();
    },
  });
};