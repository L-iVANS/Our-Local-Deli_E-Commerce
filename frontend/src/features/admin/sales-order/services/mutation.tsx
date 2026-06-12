import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../lib/api';
import { orderKeys } from './keys';
import type {
  Order,
  CreateAdminOrderInput,
  UpdateAdminOrderInput,
  TransitionAdminOrderStatusInput,
  CancelOrderInput,
} from './types';

// CREATE ORDER
// based on your controller: POST /orders
const createAdminOrder = async (input: CreateAdminOrderInput): Promise<Order> => {
  const response = await api.post('/orders', {
    body: JSON.stringify(input),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.json<Order>();
};

// UPDATE ORDER
// based on your controller: PATCH /orders/:orderId
const updateAdminOrder = async (input: UpdateAdminOrderInput): Promise<Order> => {
  const { orderId, ...payload } = input;

  const response = await api.patch(`/orders/${orderId}`, {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.json<Order>();
};

// TRANSITION ORDER STATUS
// based on your controller: POST /admin/orders/:orderId/transition
const transitionAdminOrderStatus = async (
  input: TransitionAdminOrderStatusInput
): Promise<Order> => {
  const { orderId, ...payload } = input;

  const response = await api.post(`/admin/orders/${orderId}/transition`, {
    body: JSON.stringify(payload),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return response.json<Order>();
};

// CANCEL ORDER
// based on your controller: POST /orders/:orderId/cancel
const cancelOrder = async (input: CancelOrderInput): Promise<Order> => {
  const response = await api.post(`/orders/${input.orderId}/cancel`);

  return response.json<Order>();
};

export const useCreateAdminOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Order, Error, CreateAdminOrderInput>({
    mutationFn: createAdminOrder,
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.adminList });
      queryClient.invalidateQueries({ queryKey: orderKeys.myList });
      queryClient.setQueryData(orderKeys.detail(order.orderId), order);
    },
  });
};

export const useUpdateAdminOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Order, Error, UpdateAdminOrderInput>({
    mutationFn: updateAdminOrder,
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.adminList });
      queryClient.invalidateQueries({ queryKey: orderKeys.myList });
      queryClient.setQueryData(orderKeys.detail(order.orderId), order);
    },
  });
};

export const useTransitionAdminOrderStatusMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Order, Error, TransitionAdminOrderStatusInput>({
    mutationFn: transitionAdminOrderStatus,
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.adminList });
      queryClient.invalidateQueries({ queryKey: orderKeys.myList });
      queryClient.setQueryData(orderKeys.detail(order.orderId), order);
    },
  });
};

export const useCancelOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation<Order, Error, CancelOrderInput>({
    mutationFn: cancelOrder,
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.adminList });
      queryClient.invalidateQueries({ queryKey: orderKeys.myList });
      queryClient.setQueryData(orderKeys.detail(order.orderId), order);
    },
  });
};