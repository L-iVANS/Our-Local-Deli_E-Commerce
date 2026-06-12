// features/orders/hooks/useOrders.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/features/auth';
import { api } from '../../../../lib/api';
import { orderKeys } from '../services/keys';
import type { Order } from '../services/types';

const fetchAllOrders = async (): Promise<Order[]> => {
  const response = await api.get('/admin/orders');
  return response.json<Order[]>();
};

export const useOrders = () => {
  const { isLoggedIn } = useAuth();

  return useQuery<Order[], Error>({
    queryKey: orderKeys.adminList,
    queryFn: fetchAllOrders,
    enabled: isLoggedIn,
  });
};