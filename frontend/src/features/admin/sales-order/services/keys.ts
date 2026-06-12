// features/orders/orders.keys.ts
export const orderKeys = {
  all: ['orders'] as const,
  adminList: ['admin-orders'] as const,
  myList: ['my-orders'] as const,
  detail: (orderId: number) => ['order', orderId] as const,
};