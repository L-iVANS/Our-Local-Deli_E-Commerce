export class PlaceOrderResponse {
  success: boolean;
  orderNumber: string;
  message: string;
  orderId?: number;
  createdAt?: Date;
}
