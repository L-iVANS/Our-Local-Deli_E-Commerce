// features/orders/hooks/useCancelOrder.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../lib/api';
import { orderKeys } from '../services/keys';
import type { Order } from '../services/types';

const cancelOrderFn = async (orderId: number): Promise<Order> => {
  const response = await api.post(`/orders/${orderId}/cancel`);
  return response.json<Order>();
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Order, Error, number>({
    mutationFn: cancelOrderFn,
    onSuccess: (updatedOrder) => {
      // Update the specific order in the detail cache
      queryClient.setQueryData(
        orderKeys.detail(updatedOrder.orderId),
        updatedOrder
      );

      // Optimistically update the client orders list cache
      queryClient.setQueriesData<Order[]>(
        { queryKey: orderKeys.myList },
        (oldOrders) => {
          if (!oldOrders) return oldOrders;

          return oldOrders.map((order) =>
            order.orderId === updatedOrder.orderId
              ? { ...order, ...updatedOrder }
              : order
          );
        }
      );

      // Also update admin list if it exists
      queryClient.setQueriesData<Order[]>(
        { queryKey: orderKeys.adminList },
        (oldOrders) => {
          if (!oldOrders) return oldOrders;

          return oldOrders.map((order) =>
            order.orderId === updatedOrder.orderId
              ? { ...order, ...updatedOrder }
              : order
          );
        }
      );

      // Refetch to ensure consistency
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.myList });
      queryClient.invalidateQueries({ queryKey: orderKeys.adminList });
    },
  });

  return {
    cancelOrder: async (orderId: number) => {
      return mutation.mutateAsync(orderId);
    },
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
};