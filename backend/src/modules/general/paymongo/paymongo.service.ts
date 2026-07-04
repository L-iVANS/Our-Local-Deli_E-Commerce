// src/modules/general/paymongo/paymongo.service.ts
import { Injectable, Logger, forwardRef, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { OrdersService } from '../../admin/orders/orders.service';

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

  constructor(
    private readonly configService: ConfigService,
    // ✅ Inject OrdersService with forwardRef to break circular dep
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService,
  ) {
    this.secretKey =
      this.configService.get<string>('PAYMONGO_SECRET_KEY') || '';
    this.publicKey =
      this.configService.get<string>('PAYMONGO_PUBLIC_KEY') || '';

    // Fail fast on misconfiguration
    if (!this.secretKey) {
      throw new Error(
        '[PaymongoService] PAYMONGO_SECRET_KEY is not set. Add it to .env and restart.',
      );
    }
    if (
      !this.secretKey.startsWith('sk_test_') &&
      !this.secretKey.startsWith('sk_live_')
    ) {
      throw new Error(
        `[PaymongoService] PAYMONGO_SECRET_KEY looks invalid: "${this.secretKey.slice(0, 10)}...". Must start with sk_test_ or sk_live_.`,
      );
    }

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

    this.logger.log('PaymongoService initialized ✓');
  }

  // ─── CHECKOUT SESSION (hosted checkout page) ────────────────────
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
        'http://localhost:3000/consumer/order-success';
      const failedUrl =
        this.configService.get<string>('PAYMONGO_CHECKOUT_FAILED_URL') ||
        'http://localhost:3000/consumer/order-failed';

      const successUrlWithParams = `${successUrl}?orderId=${orderId}${
        orderNumber ? `&orderNumber=${encodeURIComponent(orderNumber)}` : ''
      }${grandTotal ? `&grandTotal=${grandTotal}` : ''}`;
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
            // ✅ CRITICAL — webhook uses this to know which order to update
            metadata: {
              orderId: String(orderId),
              orderNumber: orderNumber ?? '',
            },
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

  // ─── PAYMENT INTENT (kept for backward compat) ──────────────────
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
        'http://localhost:3000/consumer/order-success';
      const failedUrl =
        this.configService.get<string>('PAYMONGO_CHECKOUT_FAILED_URL') ||
        'http://localhost:3000/consumer/order-failed';

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

      const wrappedPayload = { data: { attributes: payload } };

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

  // ─── RETRIEVE CHECKOUT SESSION (used by manual verify fallback) ─
  async retrieveCheckoutSession(checkoutSessionId: string): Promise<any> {
    try {
      const response = await this.client.get<{ data: any }>(
        `/checkout_sessions/${checkoutSessionId}`,
      );
      return response.data.data;
    } catch (error) {
      this.logger.error(
        `Failed to retrieve Checkout Session ${checkoutSessionId}:`,
        error instanceof Error ? error.message : String(error),
      );
      throw new Error(
        `PayMongo: Failed to retrieve checkout session - ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  // ─── WEBHOOK HANDLER ────────────────────────────────────────────
  /**
   * Called from PaymongoController.handleWebhook when PayMongo
   * confirms a payment. Extracts real transaction details and
   * writes them to the order via OrdersService.
   */
  async handlePaymentPaid(eventData: any): Promise<void> {
    const attributes = eventData?.attributes;
    const metadata = attributes?.metadata ?? {};

    const orderId = Number(metadata.orderId);
    if (!orderId || isNaN(orderId)) {
      this.logger.warn(
        `Webhook received without valid orderId. Metadata: ${JSON.stringify(metadata)}`,
      );
      return;
    }

    const paymongoTransactionId = eventData.id;
    const payment = attributes?.payments?.[0]?.attributes;
    const amountInCentavos = payment?.amount ?? attributes?.amount_total ?? 0;
    const paymentMethod =
      payment?.source?.type ?? attributes?.payment_method_used;
    const paidAt = payment?.paid_at;

    this.logger.log(
      `Webhook: updating order #${orderId}, txn=${paymongoTransactionId}, amount=${amountInCentavos / 100}, method=${paymentMethod}`,
    );

    await this.ordersService.updatePaymongoDetails(orderId, {
      paymongoTransactionId,
      paymongoAmount: amountInCentavos / 100,
      paymongoPaymentMethod: paymentMethod,
      paymongoTimestamp: paidAt ? new Date(paidAt * 1000) : new Date(),
    });
  }

  getPublicKey(): string {
    return this.publicKey;
  }

  isConfigured(): boolean {
    return !!(this.secretKey && this.publicKey);
  }
}