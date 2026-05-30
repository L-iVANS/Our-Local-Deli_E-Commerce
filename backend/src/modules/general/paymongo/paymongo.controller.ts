import {
  Body,
  BadRequestException,
  Controller,
  Get,
  Logger,
  Post,
  Query,
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

      const result = await this.paymongoService.createPaymentIntent(
        amount,
        orderId,
        description || `Order #${orderId}`,
      );

      return {
        success: true,
        paymentIntentId: result.paymentIntentId,
        checkoutUrl: result.checkoutUrl,
      };
    } catch (error: any) {
      this.logger.error(
        'Checkout creation failed:',
        error instanceof Error ? error.message : String(error),
      );
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

  @Get('public-key')
  getPublicKey(): { publicKey: string } {
    return {
      publicKey: this.paymongoService.getPublicKey(),
    };
  }
}
