import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      return await api.delete(`cart/items/${id}`).json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
};