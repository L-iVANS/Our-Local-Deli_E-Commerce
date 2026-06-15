import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useCatalogProducts = () => {
  return useQuery({
    queryKey: ["catalog-products"],
    queryFn: () => api.get("admin/products").json<any[]>(),
  });
};