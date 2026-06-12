// features/orders/orders.types.ts

export type OrderStatus =
  | 'PENDING_APPROVAL'
  | 'AWAITING_PAYMENT_VERIFICATION'
  | 'ACCEPT'
  | 'REJECTED'
  | 'CANCELLED'
  | 'PACKING'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'ORDERED_FROM_SUPPLIER'
  | 'READY_FOR_DELIVERY'
  | 'READY_FOR_BILLING'
  | 'PAID';

export interface Order {
  orderId: number;
  orderNumber?: string | null;
  userId: number;
  productId: number;
  orderType?: string | null;
  quantity: number;
  unitPrice?: number | null;
  totalPrice: number;
  deliveryFee?: number | null;
  grandTotal?: number | null;
  status: OrderStatus;
  deliveryStatus?: string | null;
  paymentMethod?: string | null;
  paymentProofImage?: string | null;
  paymentProofUploadedAt?: string | null;
  paymentProofStatus?: string | null;
  paymentProofAttempts?: number | null;
  paymentProofRejectionReason?: string | null;
  paymongoTransactionId?: string | null;
  paymongoAmount?: number | null;
  paymongoPaymentMethod?: string | null;
  paymongoTimestamp?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminOrderInput {
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
  status?: OrderStatus;
}

export interface UpdateAdminOrderInput {
  orderId: number;
  productId?: number;
  quantity?: number;
  unitPrice?: number;
  totalPrice?: number;
  status?: OrderStatus;
}

export interface TransitionAdminOrderStatusInput {
  orderId: number;
  nextStatus: OrderStatus;
  rejectionReason?: string;
}

export interface CancelOrderInput {
  orderId: number;
}