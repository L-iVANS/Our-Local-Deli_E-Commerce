// features/orders/api.ts
import { api } from '../../../../lib/api';
import type { Order } from './types';

/**
 * GET /admin/orders
 * Admin only — returns all orders with product relation
 */
export const fetchAllOrders = async (): Promise<Order[]> => {
  const response = await api.get('/admin/orders');
  return response.json<Order[]>();
};

/**
 * GET /orders/:orderId
 * Returns single order detail with product relation
 */
export const fetchOrderDetails = async (orderId: number): Promise<Order> => {
  const response = await api.get(`/orders/${orderId}`);
  return response.json<Order>();
};

/**
 * GET /orders
 * Returns current authenticated user's orders
 */
export const fetchClientOrders = async (): Promise<Order[]> => {
  const response = await api.get('/orders');
  return response.json<Order[]>();
};