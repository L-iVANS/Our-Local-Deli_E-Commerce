import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create.order';
import { UpdateOrderDto } from './dto/update.order';
import { TransitionOrderStatusDto } from './dto/transition.order-status';
import { RejectPaymentProofDto } from './dto/reject-payment-proof';
import { PlaceOrderDto } from './dto/place-order';
import { JwtAuthGuard } from '../../general/auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../general/auth/guards/roles.guard';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('admin/orders')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async allOrders() {
    return await this.ordersService.allOrders();
  }

  @Get('orders/:orderId')
  @UseGuards(JwtAuthGuard)
  async orderDetails(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Req() req: Request,
  ) {
    const authUser = (req as any).user;
    const userId = authUser?.userId;
    const userRole = authUser?.role;

    if (!userId) throw new ForbiddenException('Not authenticated');

    const order = await this.ordersService.orderDetails(orderId);
    if (!order) throw new Error('Order not found');

    if (order.userId !== userId && userRole !== 'admin') {
      throw new ForbiddenException('You can only view your own orders');
    }

    return order;
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard)
  async clientOrders(@Req() req: Request) {
    const authUser = (req as any).user;
    const userId = authUser?.userId;
    if (!userId) throw new Error('Unauthorized: User ID not found in request');
    return await this.ordersService.clientOrders(userId);
  }

  @Post('orders')
  @UseGuards(JwtAuthGuard)
  async createOrder(@Body() input: CreateOrderDto, @Req() req: Request) {
    const authUser = (req as any).user;
    const userId = authUser?.userId;
    if (!userId) throw new ForbiddenException('Not authenticated');
    return await this.ordersService.createOrder({
      ...input,
      userId,
    });
  }

  @Patch('orders/:orderId')
  @UseGuards(JwtAuthGuard)
  async updateOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() input: UpdateOrderDto,
    @Req() req: Request,
  ) {
    const authUser = (req as any).user;
    const userId = authUser?.userId;
    if (!userId) throw new ForbiddenException('Not authenticated');
    return await this.ordersService.updateOrder({
      ...input,
      orderId,
    });
  }

  @Post('admin/orders/:orderId/transition')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async transitionOrderStatus(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() input: TransitionOrderStatusDto,
  ) {
    return await this.ordersService.transitionOrderStatus({
      ...input,
      orderId,
    });
  }

  @Post('admin/orders/:orderId/reject-payment-proof')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async rejectPaymentProof(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Body() input: RejectPaymentProofDto,
  ) {
    return await this.ordersService.rejectPaymentProof(
      orderId,
      input.rejectionReason,
    );
  }

  @Post('admin/orders/:orderId/approve-payment-proof')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async approvePaymentProof(@Param('orderId', ParseIntPipe) orderId: number) {
    return await this.ordersService.approvePaymentProof(orderId);
  }

  @Post('orders/:orderId/cancel')
  @UseGuards(JwtAuthGuard)
  async cancelOrder(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Req() req: Request,
  ) {
    const authUser = (req as any).user;
    const userId = authUser?.userId;
    if (!userId) throw new ForbiddenException('Not authenticated');
    return await this.ordersService.cancelOrder(orderId, userId);
  }

  @Post('orders/place')
  @UseGuards(JwtAuthGuard)
  async placeOrder(@Body() input: PlaceOrderDto, @Req() req: Request) {
    const authUser = (req as any).user;

    return this.ordersService.placeOrder({
      ...input,
      userId: authUser.userId,
    });
  }

  @Post('orders/:orderId/paymongo/checkout')
  @UseGuards(JwtAuthGuard)
  async initiatePaymongoCheckout(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Req() req: Request,
  ) {
    const authUser = (req as any).user;
    const userId = authUser?.userId;
    if (!userId) throw new ForbiddenException('Not authenticated');

    const order = await this.ordersService.orderDetails(orderId);
    if (!order) throw new ForbiddenException('Order not found');

    const userRole = authUser?.role;
    if (order.userId !== userId && userRole !== 'admin') {
      throw new ForbiddenException('You can only pay for your own orders');
    }

    const result = await this.ordersService.initiatePaymongoCheckout(orderId);
    return {
      success: true,
      ...result,
    };
  }

  @Post('orders/:orderId/paymongo/confirm')
  @UseGuards(JwtAuthGuard)
  async confirmPaymongoPayment(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Req() req: Request,
  ) {
    const authUser = (req as any).user;
    const userId = authUser?.userId;
    if (!userId) throw new ForbiddenException('Not authenticated');

    const order = await this.ordersService.orderDetails(orderId);
    if (!order) throw new ForbiddenException('Order not found');

    const userRole = authUser?.role;
    if (order.userId !== userId && userRole !== 'admin') {
      throw new ForbiddenException('You can only confirm your own orders');
    }

    return await this.ordersService.confirmPaymongoPayment(orderId);
  }
}
