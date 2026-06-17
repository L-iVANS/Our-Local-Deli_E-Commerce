import { api } from "@/lib/api";

export const catalogService = {
  getProducts: async () => {
    return api.get("admin/products").json<any[]>();
  },
};