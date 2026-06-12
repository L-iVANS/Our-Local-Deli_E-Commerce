// features/orders/hooks/useCreateOrder.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../lib/api';
import { orderKeys } from '../services/keys';
import type { Order, CreateAdminOrderInput } from '../services/types';

const createOrder = async (input: CreateAdminOrderInput): Promise<Order> => {
  const response = await api.post('/orders', {
    body: JSON.stringify(input),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.json<Order>();
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Order, Error, CreateAdminOrderInput>({
    mutationFn: createOrder,
    onSuccess: (order) => {
      queryClient.setQueryData(orderKeys.detail(order.orderId), order);
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.adminList });
      queryClient.invalidateQueries({ queryKey: orderKeys.myList });
    },
  });

  return {
    createOrder: mutation.mutateAsync,
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
};