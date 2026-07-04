import {
  Body,
  BadRequestException,
  Controller,
  Get,
  Logger,
  Post,
  Query,
  HttpCode,
  Headers,
} from '@nestjs/common';
import { PaymongoService } from './paymongo.service';

interface CreateCheckoutDto {
  orderId: number;
  amount: number;
  description?: string;
}

interface CheckoutResponse {
  success: boolean;
  paymentIntentId: string;
  checkoutUrl: string;
  message?: string;
}

@Controller('paymongo')
export class PaymongoController {
  private readonly logger = new Logger(PaymongoController.name);

  constructor(private readonly paymongoService: PaymongoService) {}

  @Post('checkout')
  async createCheckout(
    @Body() createCheckoutDto: CreateCheckoutDto,
  ): Promise<CheckoutResponse> {
    try {
      const { orderId, amount, description } = createCheckoutDto;

      if (!orderId || !amount) {
        throw new BadRequestException('orderId and amount are required');
      }
      if (amount <= 0) {
        throw new BadRequestException('amount must be greater than 0');
      }

      this.logger.log(
        `Creating checkout for Order #${orderId}, Amount: PHP ${amount}`,
      );

      // ✅ FIXED: was createPaymentIntent (wrong), now createCheckoutLink (correct)
      const result = await this.paymongoService.createCheckoutLink(
        amount,
        orderId,
        description || `Order #${orderId}`,
      );

      return {
        success: true,
        paymentIntentId: result.checkoutId, // checkoutId maps to this field
        checkoutUrl: result.checkoutUrl,
      };
    } catch (error: any) {
      this.logger.error(
        'Checkout creation failed:',
        error instanceof Error ? error.message : String(error),
      );

      // Surface PayMongo API error details to logs
      if (error?.response?.data) {
        this.logger.error(
          'PayMongo API error:',
          JSON.stringify(error.response.data, null, 2),
        );
      }

      throw error;
    }
  }

  @Get('status')
  async getPaymentStatus(
    @Query('paymentIntentId') paymentIntentId: string,
  ): Promise<{
    status: string;
    amount: number;
    amountInPhp: number;
    description: string;
  }> {
    try {
      if (!paymentIntentId) {
        throw new BadRequestException(
          'paymentIntentId query parameter is required',
        );
      }

      this.logger.log(`Checking payment status for Intent: ${paymentIntentId}`);

      const result =
        await this.paymongoService.retrievePaymentIntent(paymentIntentId);

      return result;
    } catch (error: any) {
      this.logger.error(
        'Status check failed:',
        error instanceof Error ? error.message : String(error),
      );
      throw error;
    }
  }

  @Post('webhook')
  @HttpCode(200)   // ← PayMongo requires 200, not 201
  async handleWebhook(
    @Body() payload: any,
    @Headers('paymongo-signature') signature: string,
  ) {
    this.logger.log(`Webhook received: ${payload?.data?.attributes?.type}`);

    // Optional but recommended: verify signature
    // this.paymongoService.verifyWebhookSignature(payload, signature);

    const eventType = payload?.data?.attributes?.type;
    const eventData = payload?.data?.attributes?.data;

    if (eventType === 'checkout_session.payment.paid') {
      await this.paymongoService.handlePaymentPaid(eventData);
    }

    return { received: true };
  }

  @Get('public-key')
  getPublicKey(): { publicKey: string } {
    return {
      publicKey: this.paymongoService.getPublicKey(),
    };
  }
}
