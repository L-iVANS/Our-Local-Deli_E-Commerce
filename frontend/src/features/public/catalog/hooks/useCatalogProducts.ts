import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useCatalogProducts = () => {
  return useQuery({
    queryKey: ["catalog-products"],
    queryFn: () => api.get("cart/products").json<any[]>(),
  });
};