// features/orders/hooks/useRejectPaymentProof.ts
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../lib/api';
import { orderKeys } from '../services/keys';
import type { Order } from '../services/types';

interface RejectPaymentProofInput {
  orderId: number;
  rejectionReason: string;
}

const rejectPaymentProof = async (
  input: RejectPaymentProofInput
): Promise<Order> => {
  const { orderId, rejectionReason } = input;

  const response = await api.post(
    `/admin/orders/${orderId}/reject-payment-proof`,
    {
      body: JSON.stringify({ rejectionReason }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response.json<Order>();
};

export const useRejectPaymentProof = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<Order, Error, RejectPaymentProofInput>({
    mutationFn: rejectPaymentProof,
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

      // Refetch for full consistency (like awaitRefetchQueries)
      queryClient.invalidateQueries({ queryKey: orderKeys.adminList });
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });

  return {
    rejectPaymentProof: mutation.mutateAsync,
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    data: mutation.data,
  };
};