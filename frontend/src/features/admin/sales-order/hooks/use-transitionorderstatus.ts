// features/orders/hooks/useTransitionOrderStatus.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../lib/api';
import { orderKeys } from '../services/keys';
import type { Order, TransitionAdminOrderStatusInput } from '../services/types';

const transitionOrderStatus = async (
  input: TransitionAdminOrderStatusInput
): Promise<Order> => {
  const { orderId, ...payload } = input;

  const response = await api.post(
    `/admin/orders/${orderId}/transition`,
    {
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response.json<Order>();
};

export const useTransitionOrderStatus = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Order, Error, TransitionAdminOrderStatusInput>({
    mutationFn: transitionOrderStatus,
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

      // Await refetch like Apollo's awaitRefetchQueries
      queryClient.invalidateQueries({ queryKey: orderKeys.adminList });
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.myList });
    },
  });

  return {
    transitionOrderStatus: mutation.mutateAsync,
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
};