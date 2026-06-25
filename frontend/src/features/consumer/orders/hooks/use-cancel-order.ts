import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelOrder } from "../services/orderService";

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });
}