// src/features/public/cart/services/mutation.tsx

import { api } from '@/lib/api';

export interface PlaceOrderItem {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface PlaceOrderDelivery {
  address: string;
  contactPerson: string;
  contactNumber: string;
  deliveryDate: string;
  notes: string;
}

export interface PlaceOrderPayload {
  items: PlaceOrderItem[];
  delivery: PlaceOrderDelivery;
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  paymentMethod: 'e-payment' | 'manual_transfer';
}

export interface PlaceOrderResult {
  success: boolean;
  orderNumber: string;
  message: string;
  orderId: number;
  createdAt: string;
}

export const placeOrderService = {
  placeOrder: (payload: PlaceOrderPayload): Promise<PlaceOrderResult> => {
    return api.post('orders/place', { json: payload }).json<PlaceOrderResult>();
  },
};