export class PaymongoCheckoutResponse {
  success: boolean;
  paymentIntentId: string;
  checkoutUrl: string;
  message: string;
}
