export class PlaceOrderResponse {
  declare success: boolean;
  declare orderNumber: string;
  declare message: string;
  declare orderId?: number;
  declare createdAt?: Date;
}
