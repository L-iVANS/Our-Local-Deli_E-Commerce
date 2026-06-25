import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrderStatus } from "../services/orderService";
import type { OrderStatus } from "../types/order";

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      status,
    }: {
      orderId: number;
      status: OrderStatus;
    }) => updateOrderStatus(orderId, status),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });
}