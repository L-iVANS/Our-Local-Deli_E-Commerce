import { api } from "@/lib/api";
import type { OrderStatus } from "../types/order";

/**
 * Create order
 * POST /orders
 */
export async function createOrderFromCart(
  items: {
    productId: number;
    quantity: number;
    unitPrice: number;
  }[],
  orderType?: string,
) {
  const responses = await Promise.all(
    items.map((item) =>
      api
        .post("orders", {
          json: {
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
            orderType,
          },
        })
        .json(),
    ),
  );

  return responses;
}

/**
 * GET /orders
 */
export async function fetchCustomerOrders() {
  return api.get("orders").json();
}

/**
 * GET /admin/orders
 */
export async function fetchAllOrders() {
  return api.get("admin/orders").json();
}

/**
 * GET /orders/:orderId
 */
export async function fetchOrderById(orderId: number) {
  return api.get(`orders/${orderId}`).json();
}

/**
 * PATCH /orders/:orderId
 */
export async function updateOrder(
  orderId: number,
  input: Record<string, any>,
) {
  return api.patch(`orders/${orderId}`, {
    json: input,
  }).json();
}

/**
 * POST /admin/orders/:orderId/transition
 */
export async function updateOrderStatus(
  orderId: number,
  newStatus: OrderStatus,
) {
  return api.post(`admin/orders/${orderId}/transition`, {
    json: {
      nextStatus: newStatus,
    },
  }).json();
}

/**
 * POST /orders/:orderId/cancel
 */
export async function cancelOrder(orderId: number) {
  return api.post(`orders/${orderId}/cancel`).json();
}

/**
 * POST /orders/place
 */
export async function placeOrder(input: any) {
  return api.post("orders/place", {
    json: input,
  }).json();
}

/**
 * POST /orders/:orderId/paymongo/checkout
 */
export async function initiatePaymongoCheckout(orderId: number) {
  return api.post(
    `orders/${orderId}/paymongo/checkout`,
  ).json();
}

/**
 * POST /orders/:orderId/paymongo/confirm
 */
export async function confirmPaymongoPayment(orderId: number) {
  return api.post(
    `orders/${orderId}/paymongo/confirm`,
  ).json();
}