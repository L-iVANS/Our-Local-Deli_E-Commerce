export class PaymongoCheckoutResponse {
  declare success: boolean;
  declare paymentIntentId: string;
  declare checkoutUrl: string;
  declare message: string;
}
