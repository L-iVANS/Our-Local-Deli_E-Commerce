import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      quantity,
    }: {
      id: number;
      quantity: number;
    }) => {
      return await api.patch(`cart/items/${id}`, {
        json: { quantity },
      }).json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["cart"],
      });
    },
  });
};