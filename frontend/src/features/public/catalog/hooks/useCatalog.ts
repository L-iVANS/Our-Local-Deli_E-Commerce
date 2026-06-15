import { useQuery } from "@tanstack/react-query";
import { catalogService } from "../services/catalog-service";

export const useCatalogProducts = () => {
  return useQuery({
    queryKey: ["catalog-products"],
    queryFn: catalogService.getProducts,
  });
};