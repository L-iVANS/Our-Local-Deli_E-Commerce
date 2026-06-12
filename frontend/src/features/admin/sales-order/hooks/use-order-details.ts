// features/orders/hooks/useOrderDetails.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '../../../../lib/api';
import { orderKeys } from '../services/keys';
import type { Order } from '..//services/types';

const fetchOrderDetails = async (orderId: number): Promise<Order> => {
  const response = await api.get(`/orders/${orderId}`);
  return response.json<Order>();
};

export const useOrderDetails = (orderId: number) => {
  return useQuery<Order, Error>({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => fetchOrderDetails(orderId),
    enabled: orderId > 0,
  });
};