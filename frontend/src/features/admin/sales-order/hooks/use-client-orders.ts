// features/orders/hooks/useClientOrders.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '../../../../lib/api';
import { orderKeys } from '../services/keys';
import type { Order } from '../services/types';

const fetchClientOrders = async (): Promise<Order[]> => {
  const response = await api.get('/orders');
  return response.json<Order[]>();
};

export const useClientOrders = () => {
  return useQuery<Order[], Error>({
    queryKey: orderKeys.myList,
    queryFn: fetchClientOrders,
  });
};