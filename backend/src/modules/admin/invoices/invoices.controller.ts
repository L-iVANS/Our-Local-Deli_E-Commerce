import {
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { InvoicesService } from './invoices.service';
import { OrdersService } from '../orders/orders.service';
import { JwtAuthGuard } from '../../general/auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../general/auth/guards/roles.guard';

@Controller()
export class InvoicesController {
  constructor(
    private readonly invoicesService: InvoicesService,
    private readonly ordersService: OrdersService,
  ) {}

  @Get('admin/invoices')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async allInvoices() {
    return this.invoicesService.getAllInvoices();
  }

  @Get('invoices/order/:orderId')
  @UseGuards(JwtAuthGuard)
  async invoiceByOrderId(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Req() req: Request,
  ) {
    const authUser = (req as any).user;
    const userId = authUser?.userId;
    const userRole = authUser?.role;

    if (userRole !== 'admin') {
      const order = await this.ordersService.orderDetails(orderId);
      if (!order || order.userId !== userId) {
        throw new ForbiddenException(
          'You do not have permission to view this invoice',
        );
      }
    }

    return this.invoicesService.getInvoiceByOrderId(orderId);
  }

  @Post('invoices/order/:orderId/pay')
  @UseGuards(JwtAuthGuard)
  async payInvoiceByOrderId(
    @Param('orderId', ParseIntPipe) orderId: number,
    @Req() req: Request,
  ) {
    const authUser = (req as any).user;
    const userId = authUser?.userId;
    const userRole = authUser?.role;

    if (userRole !== 'admin') {
      const order = await this.ordersService.orderDetails(orderId);
      if (!order || order.userId !== userId) {
        throw new ForbiddenException(
          'You do not have permission to pay this invoice',
        );
      }
    }

    return this.invoicesService.payInvoiceByOrderId(orderId);
  }
}
