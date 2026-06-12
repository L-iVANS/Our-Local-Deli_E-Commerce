// features/orders/hooks/useUpdateOrder.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../lib/api';
import { orderKeys } from '../services/keys';
import type { Order, UpdateAdminOrderInput } from '../services/types';

const updateOrder = async (input: UpdateAdminOrderInput): Promise<Order> => {
  const { orderId, ...payload } = input;

  const response = await api.patch(`/orders/${orderId}`, {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.json<Order>();
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Order, Error, UpdateAdminOrderInput>({
    mutationFn: updateOrder,
    onSuccess: (order) => {
      queryClient.setQueryData(orderKeys.detail(order.orderId), order);

      queryClient.setQueriesData<Order[]>(
        { queryKey: orderKeys.adminList },
        (oldOrders) => {
          if (!oldOrders) return oldOrders;
          return oldOrders.map((o) =>
            o.orderId === order.orderId ? { ...o, ...order } : o
          );
        }
      );

      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.adminList });
      queryClient.invalidateQueries({ queryKey: orderKeys.myList });
    },
  });

  return {
    updateOrder: mutation.mutateAsync,
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
};