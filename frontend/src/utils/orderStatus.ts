import type { OrderStatus } from '../features/admin/sales-order/services/types';

const VALID_ORDER_STATUSES: OrderStatus[] = [
  'PENDING_APPROVAL',
  'AWAITING_PAYMENT_VERIFICATION',
  'ACCEPT',
  'REJECTED',
  'CANCELLED',
  'PACKING',
  'IN_TRANSIT',
  'DELIVERED',
  'ORDERED_FROM_SUPPLIER',
  'READY_FOR_DELIVERY',
  'READY_FOR_BILLING',
  'PAID',
];

export const isValidOrderStatus = (value: string): value is OrderStatus => {
  return VALID_ORDER_STATUSES.includes(value as OrderStatus);
};

export const toOrderStatus = (value: string): OrderStatus => {
  if (!isValidOrderStatus(value)) {
    throw new Error(`Invalid order status: ${value}`);
  }
  return value;
};