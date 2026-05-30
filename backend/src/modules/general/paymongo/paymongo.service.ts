import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';

interface PaymentIntentPayload {
  amount: number;
  currency: string;
  description?: string;
  statementDescriptor?: string;
  payment_method_allowed: string[];
  redirect?: {
    success: string;
    failed: string;
  };
}

interface PaymentIntentResponse {
  id: string;
  type: string;
  attributes: {
    amount: number;
    status: string;
    currency: string;
    description: string;
    statementDescriptor: string;
    createdAt: string;
    updatedAt: string;
    clientKey: string;
    paymentMethodWhitelist: string[];
    paymentMethodBlacklist: string[];
    nextAction: {
      type: string;
      redirect: {
        url: string;
      };
    };
  };
}

@Injectable()
export class PaymongoService {
  private readonly logger = new Logger(PaymongoService.name);
  private readonly client: AxiosInstance;
  private readonly secretKey: string;
  private readonly publicKey: string;

  constructor(private readonly configService: ConfigService) {
    this.secretKey = this.configService.get<string>('PAYMONGO_SECRET_KEY') || '';
    this.publicKey = this.configService.get<string>('PAYMONGO_PUBLIC_KEY') || '';
    const apiUrl =
      this.configService.get<string>('PAYMONGO_API_URL') ||
      'https://api.paymongo.com/v1';

    const encodedKey = Buffer.from(`${this.secretKey}:`).toString('base64');

    this.client = axios.create({
      baseURL: apiUrl,
      headers: {
        Authorization: `Basic ${encodedKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 30000,
    });
  }

  async createCheckoutLink(
    amount: number,
    orderId: number,
    description?: string,
    orderNumber?: string,
    grandTotal?: number,
  ): Promise<{
    checkoutId: string;
    checkoutUrl: string;
    status: string;
  }> {
    try {
      this.logger.debug(
        `createCheckoutLink called with: amount=${amount}, orderId=${orderId}, description=${description}, orderNumber=${orderNumber}, grandTotal=${grandTotal}`,
      );

      const amountInCentavos = Math.round(amount * 100);

      if (!amount || amount <= 0 || isNaN(amount)) {
        throw new Error(`Invalid amount: ${amount}`);
      }

      if (amountInCentavos <= 0 || isNaN(amountInCentavos)) {
        throw new Error(`Invalid amount in centavos: ${amountInCentavos}`);
      }

      const successUrl =
        this.configService.get<string>('PAYMONGO_CHECKOUT_SUCCESS_URL') ||
        'http://localhost:3000/b2b/checkout/success';
      const failedUrl =
        this.configService.get<string>('PAYMONGO_CHECKOUT_FAILED_URL') ||
        'http://localhost:3000/b2b/checkout/failed';

      const successUrlWithParams = `${successUrl}?orderId=${orderId}${orderNumber ? `&orderNumber=${encodeURIComponent(orderNumber)}` : ''}${grandTotal ? `&grandTotal=${grandTotal}` : ''}`;
      const failedUrlWithParams = `${failedUrl}?orderId=${orderId}`;

      const payload = {
        data: {
          attributes: {
            description: description || `Order #${orderId}`,
            payment_method_types: ['card', 'paymaya', 'gcash'],
            line_items: [
              {
                amount: amountInCentavos,
                currency: 'PHP',
                name: description || `Order #${orderId}`,
                description: description || `Order #${orderId}`,
                quantity: 1,
              },
            ],
            success_url: successUrlWithParams,
            cancel_url: failedUrlWithParams,
            show_line_items: true,
          },
        },
      };

      this.logger.debug(
        `PayMongo Checkout Link Request: ${JSON.stringify(payload)}`,
      );

      const response = await this.client.post<{ data: any }>(
        '/checkout_sessions',
        payload,
      );

      const data = response.data.data;
      const checkoutUrl = data.attributes?.checkout_url || '';

      this.logger.debug(
        `Full Checkout Link Response: ${JSON.stringify(response.data)}`,
      );
      this.logger.debug(`Checkout URL: ${checkoutUrl}`);

      if (!checkoutUrl) {
        this.logger.error(
          `No checkout URL in response: ${JSON.stringify(data.attributes)}`,
        );
        throw new Error('Failed to get checkout URL from PayMongo');
      }

      this.logger.log(
        `Checkout Link created: ${data.id} for Order #${orderId}`,
      );

      return {
        checkoutId: data.id,
        checkoutUrl,
        status: data.attributes?.status || 'pending',
      };
    } catch (error) {
      this.logger.error(
        `Failed to create Checkout Link for Order #${orderId}:`,
        error instanceof Error ? error.message : String(error),
      );

      if (error instanceof Error && 'response' in error) {
        const axiosError = error as any;
        this.logger.error(
          `PayMongo API Error Response: ${JSON.stringify(axiosError.response?.data)}`,
        );
      }

      throw new Error(
        `PayMongo: Failed to create checkout link - ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async createPaymentIntent(
    amount: number,
    orderId: number,
    description?: string,
  ): Promise<{
    paymentIntentId: string;
    checkoutUrl: string;
    status: string;
  }> {
    try {
      this.logger.debug(
        `createPaymentIntent called with: amount=${amount}, orderId=${orderId}, description=${description}`,
      );

      const amountInCentavos = Math.round(amount * 100);

      if (!amount || amount <= 0 || isNaN(amount)) {
        throw new Error(`Invalid amount: ${amount}`);
      }

      if (amountInCentavos <= 0 || isNaN(amountInCentavos)) {
        throw new Error(`Invalid amount in centavos: ${amountInCentavos}`);
      }

      const successUrl =
        this.configService.get<string>('PAYMONGO_CHECKOUT_SUCCESS_URL') ||
        'http://localhost:3000/b2b/checkout/success';
      const failedUrl =
        this.configService.get<string>('PAYMONGO_CHECKOUT_FAILED_URL') ||
        'http://localhost:3000/b2b/checkout/failed';

      const payload: PaymentIntentPayload = {
        amount: amountInCentavos,
        currency: 'PHP',
        description: description || `Order #${orderId}`,
        statementDescriptor: `ORDER-${orderId}`,
        payment_method_allowed: ['card', 'paymaya', 'gcash'],
        redirect: {
          success: `${successUrl}?orderId=${orderId}`,
          failed: `${failedUrl}?orderId=${orderId}`,
        },
      };

      this.logger.debug(
        `PayMongo API Request Payload: ${JSON.stringify(payload)}`,
      );

      const wrappedPayload = {
        data: {
          attributes: payload,
        },
      };

      this.logger.debug(
        `PayMongo API Wrapped Payload: ${JSON.stringify(wrappedPayload)}`,
      );

      const response = await this.client.post<{ data: PaymentIntentResponse }>(
        '/payment_intents',
        wrappedPayload,
      );

      const data = response.data.data;
      const checkoutUrl = data.attributes.nextAction?.redirect?.url || '';

      this.logger.log(
        `Payment Intent created: ${data.id} for Order #${orderId}, Amount: PHP ${amount}`,
      );

      this.logger.debug(
        `Full PayMongo Response: ${JSON.stringify(response.data)}`,
      );
      this.logger.debug(`Extracted data: ${JSON.stringify(data)}`);
      this.logger.debug(`Checkout URL: ${checkoutUrl}`);

      if (!checkoutUrl) {
        this.logger.error(
          `No checkout URL found in PayMongo response. nextAction: ${JSON.stringify(data.attributes.nextAction)}`,
        );
      }

      return {
        paymentIntentId: data.id,
        checkoutUrl,
        status: data.attributes.status,
      };
    } catch (error) {
      this.logger.error(
        `Failed to create Payment Intent for Order #${orderId}:`,
        error instanceof Error ? error.message : String(error),
      );
      if (error instanceof Error && 'response' in error) {
        const axiosError = error as any;
        this.logger.error(
          `PayMongo API Response: ${JSON.stringify(axiosError.response?.data)}`,
        );
      }
      throw new Error(
        `PayMongo: Failed to create payment intent - ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async retrievePaymentIntent(paymentIntentId: string): Promise<{
    status: string;
    amount: number;
    amountInPhp: number;
    description: string;
  }> {
    try {
      const response = await this.client.get<{ data: PaymentIntentResponse }>(
        `/payment_intents/${paymentIntentId}`,
      );

      const data = response.data.data;

      this.logger.log(
        `Retrieved Payment Intent: ${paymentIntentId}, Status: ${data.attributes.status}`,
      );

      return {
        status: data.attributes.status,
        amount: data.attributes.amount,
        amountInPhp: data.attributes.amount / 100,
        description: data.attributes.description,
      };
    } catch (error) {
      this.logger.error(
        `Failed to retrieve Payment Intent ${paymentIntentId}:`,
        error instanceof Error ? error.message : String(error),
      );
      throw new Error(
        `PayMongo: Failed to retrieve payment intent - ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  getPublicKey(): string {
    return this.publicKey;
  }

  isConfigured(): boolean {
    return !!(this.secretKey && this.publicKey);
  }
}
