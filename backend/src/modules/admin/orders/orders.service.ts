import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { randomUUID } from 'crypto';
import { OrdersTbl } from './entity/orders.tbl';
import { CreateOrderDto } from './dto/create.order';
import { UpdateOrderDto } from './dto/update.order';
import { OrderStatus } from './entity/order-status.enum';
import { TransitionOrderStatusDto } from './dto/transition.order-status';
import { PlaceOrderDto } from './dto/place-order';
import { PlaceOrderResponse } from './entity/place-order-response';
import { InvoicesService } from '../invoices/invoices.service';
import { ProductsTbl } from '../products/entity/products.tbl';
import { UsersTbl } from '../../general/auth/entity/users.tbl';
import { InvoicesTbl } from '../invoices/entity/invoices.tbl';
import { MailerService } from '../../general/mailer/mailer.service';
import { NotificationsService } from '../../general/notifications/notifications.service';
import { PaymongoService } from '../../general/paymongo/paymongo.service';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    @InjectRepository(OrdersTbl)
    private readonly ordersRepository: Repository<OrdersTbl>,
    @InjectRepository(ProductsTbl)
    private readonly productsRepository: Repository<ProductsTbl>,
    @InjectRepository(UsersTbl)
    private readonly usersRepository: Repository<UsersTbl>,
    private readonly invoicesService: InvoicesService,
    private readonly mailerService: MailerService,
    private readonly notificationsService: NotificationsService,
    private readonly paymongoService: PaymongoService,
  ) {}

  private readonly validTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING_APPROVAL]: [
      OrderStatus.AWAITING_PAYMENT_VERIFICATION,
      OrderStatus.REJECTED,
      OrderStatus.CANCELLED,
    ],
    [OrderStatus.AWAITING_PAYMENT_VERIFICATION]: [
      OrderStatus.ACCEPT,
      OrderStatus.REJECTED,
      OrderStatus.CANCELLED,
    ],
    [OrderStatus.ACCEPT]: [
      OrderStatus.PACKING,
      OrderStatus.REJECTED,
      OrderStatus.CANCELLED,
    ],
    [OrderStatus.PACKING]: [
      OrderStatus.IN_TRANSIT,
      OrderStatus.REJECTED,
      OrderStatus.CANCELLED,
    ],
    [OrderStatus.IN_TRANSIT]: [
      OrderStatus.DELIVERED,
      OrderStatus.REJECTED,
      OrderStatus.CANCELLED,
    ],
    [OrderStatus.DELIVERED]: [OrderStatus.CANCELLED],
    [OrderStatus.REJECTED]: [],
    [OrderStatus.CANCELLED]: [],
    [OrderStatus.ORDERED_FROM_SUPPLIER]: [
      OrderStatus.READY_FOR_DELIVERY,
      OrderStatus.REJECTED,
      OrderStatus.CANCELLED,
    ],
    [OrderStatus.READY_FOR_DELIVERY]: [
      OrderStatus.PACKING,
      OrderStatus.REJECTED,
      OrderStatus.CANCELLED,
    ],
    [OrderStatus.READY_FOR_BILLING]: [
      OrderStatus.PAID,
      OrderStatus.REJECTED,
      OrderStatus.CANCELLED,
    ],
    [OrderStatus.PAID]: [OrderStatus.DELIVERED, OrderStatus.CANCELLED],
  };

  async allOrders() {
    const orders = await this.ordersRepository.find({
      relations: { product: true },
      order: { createdAt: 'DESC', orderId: 'ASC' },
    });
    return orders.map((order) => ({
      ...order,
      productName: order.product?.productName,
    }));
  }

  async orderDetails(orderId: number) {
    const order = await this.ordersRepository.findOne({
      where: { orderId },
      relations: { product: true },
    });
    if (!order) {
      return null;
    }
    return {
      ...order,
      productName: order.product?.productName,
    };
  }

  async clientOrders(userId: number) {
    const orders = await this.ordersRepository.find({
      where: { userId },
      relations: { product: true },
      order: { createdAt: 'DESC', orderId: 'ASC' },
    });
    return orders.map((order) => ({
      ...order,
      productName: order.product?.productName,
    }));
  }

  async createOrder(createOrderDto: CreateOrderDto) {
    const product = await this.productsRepository.findOne({
      where: { productId: createOrderDto.productId },
    });

    if (!product) {
      throw new NotFoundException(
        `Product ${createOrderDto.productId} not found. Please refresh products and try again.`,
      );
    }

    const order = this.ordersRepository.create({
      ...createOrderDto,
      status: createOrderDto.status ?? OrderStatus.PENDING_APPROVAL,
    });
    const savedOrder = await this.ordersRepository.save(order);
    this.logger.log(`Order saved: ${JSON.stringify(savedOrder)}`);

    try {
      const customer = await this.usersRepository.findOne({
        where: { userId: createOrderDto.userId },
      });

      const adminUserId = 1;

      await this.notificationsService.createNotification({
        userId: adminUserId,
        type: 'new_order',
        title: 'New Order Received',
        message: `New order placed by ${customer?.companyName || `Customer #${createOrderDto.userId}`}.

Product: ${product.productName}
Quantity: ${createOrderDto.quantity}
Total: PHP ${(
          createOrderDto.quantity * createOrderDto.unitPrice
        ).toLocaleString()}`,
        orderId: savedOrder.orderId,
        metadata: JSON.stringify({
          customerName: customer?.companyName,
          productName: product.productName,
          quantity: createOrderDto.quantity,
          totalPrice: createOrderDto.quantity * createOrderDto.unitPrice,
        }),
      });
    } catch (err: any) {
      this.logger.warn(
        `Failed to create admin notification for new order #${savedOrder.orderId}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }

    try {
      const invoice =
        await this.invoicesService.createInvoiceForOrder(savedOrder);
      this.logger.log(
        `Invoice created for orderId ${savedOrder.orderId}: ${JSON.stringify(invoice)}`,
      );
    } catch (err: any) {
      this.logger.error(
        `Failed to create invoice for orderId ${savedOrder.orderId}: ${err}`,
      );
    }
    return savedOrder;
  }

  async updateOrder(updateOrderDto: UpdateOrderDto) {
    const order = await this.ordersRepository.findOne({
      where: { orderId: updateOrderDto.orderId },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const previousStatus = order.status as OrderStatus;
    const { orderId, ...updates } = updateOrderDto;

    if (updates.status && updates.status !== order.status) {
      this.assertTransitionAllowed(order.status as OrderStatus, updates.status);
    }

    Object.assign(order, updates);

    const savedOrder = await this.ordersRepository.save(order);

    if (
      updates.status &&
      previousStatus !== (savedOrder.status as OrderStatus)
    ) {
      void this.sendOrderStatusNotificationEmail(
        savedOrder,
        previousStatus,
        null,
      ).catch((error: unknown) => {
        this.logger.error(
          `Order status email dispatch failed for order #${savedOrder.orderId}`,
          error instanceof Error ? error.stack : String(error),
        );
      });
    }

    return savedOrder;
  }

  async transitionOrderStatus(transitionDto: TransitionOrderStatusDto) {
    const { targetOrder, groupedOrders } = await this.getOrderGroupFromOrderId(
      transitionDto.orderId,
    );
    const previousStatus = targetOrder.status as OrderStatus;

    if (
      groupedOrders.every(
        (o) => (o.status as OrderStatus) === transitionDto.nextStatus,
      )
    ) {
      return targetOrder;
    }

    for (const groupedOrder of groupedOrders) {
      const currentStatus = groupedOrder.status as OrderStatus;
      if (currentStatus !== transitionDto.nextStatus) {
        this.assertTransitionAllowed(currentStatus, transitionDto.nextStatus);
      }

      groupedOrder.status = transitionDto.nextStatus;

      if (
        transitionDto.nextStatus === OrderStatus.REJECTED &&
        transitionDto.rejectionReason
      ) {
        groupedOrder.rejectionReason = transitionDto.rejectionReason;
      }
    }

    const updatedOrders = await this.ordersRepository.save(groupedOrders);
    const updatedOrder =
      updatedOrders.find((o) => o.orderId === targetOrder.orderId) ??
      updatedOrders[0];

    void this.sendOrderStatusNotificationEmail(
      updatedOrder,
      previousStatus,
      null,
    ).catch((error: unknown) => {
      this.logger.error(
        `Order status email dispatch failed for order #${updatedOrder.orderId}`,
        error instanceof Error ? error.stack : String(error),
      );
    });

    return updatedOrder;
  }

  async rejectPaymentProof(
    orderId: number,
    rejectionReason: string,
  ): Promise<OrdersTbl> {
    const { targetOrder, groupedOrders } =
      await this.getOrderGroupFromOrderId(orderId);
    const user = await this.usersRepository.findOne({
      where: { userId: targetOrder.userId },
    });

    for (const groupedOrder of groupedOrders) {
      groupedOrder.paymentProofAttempts =
        (groupedOrder.paymentProofAttempts || 0) + 1;
      groupedOrder.paymentProofStatus = 'rejected';
      groupedOrder.paymentProofRejectionReason = rejectionReason;

      if (groupedOrder.paymentProofAttempts >= 3) {
        groupedOrder.status = OrderStatus.REJECTED;
        groupedOrder.rejectionReason = `Payment proof rejected after ${groupedOrder.paymentProofAttempts} attempts. Last reason: ${rejectionReason}`;
      }
    }

    const updatedOrders = await this.ordersRepository.save(groupedOrders);
    const updatedOrder =
      updatedOrders.find((o) => o.orderId === targetOrder.orderId) ??
      updatedOrders[0];

    if (user) {
      const attemptsLeft = Math.max(0, 3 - updatedOrder.paymentProofAttempts);
      try {
        await this.notificationsService.createNotification({
          userId: targetOrder.userId,
          type: 'payment_proof_rejected',
          title: 'Payment Proof Rejected',
          message: `Your payment proof for order ${targetOrder.orderNumber} has been rejected.

Reason: ${rejectionReason}

${attemptsLeft > 0 ? `Please upload a valid proof. Attempts left: ${attemptsLeft}` : 'Maximum upload attempts reached. Please contact support.'}`,
          orderId: orderId,
          metadata: JSON.stringify({
            rejectionReason,
            attemptNumber: updatedOrder.paymentProofAttempts,
            attemptsLeft,
          }),
        });
      } catch (err: any) {
        this.logger.error(
          `Failed to create notification for order #${orderId}:`,
          err,
        );
      }

      void this.sendPaymentProofRejectedEmail(updatedOrder).catch(
        (error: unknown) => {
          this.logger.error(
            `Payment proof rejection email failed for order #${orderId}`,
            error instanceof Error ? error.stack : String(error),
          );
        },
      );
    }

    return updatedOrder;
  }

  async approvePaymentProof(orderId: number): Promise<OrdersTbl> {
    const { targetOrder, groupedOrders } =
      await this.getOrderGroupFromOrderId(orderId);

    for (const groupedOrder of groupedOrders) {
      groupedOrder.paymentProofStatus = 'approved';
      groupedOrder.status = OrderStatus.PACKING;
    }

    const updatedOrders = await this.ordersRepository.save(groupedOrders);
    const updatedOrder =
      updatedOrders.find((o) => o.orderId === targetOrder.orderId) ??
      updatedOrders[0];

    void this.sendOrderStatusNotificationEmail(
      updatedOrder,
      OrderStatus.AWAITING_PAYMENT_VERIFICATION,
      null,
    ).catch((error: unknown) => {
      this.logger.error(
        `Payment approved email failed for order #${orderId}`,
        error instanceof Error ? error.stack : String(error),
      );
    });

    return updatedOrder;
  }

  async cancelOrder(orderId: number, userId: number): Promise<OrdersTbl> {
    const order = await this.ordersRepository.findOne({ where: { orderId } });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.userId !== userId) {
      throw new ForbiddenException('You can only cancel your own orders');
    }

    const currentStatus = order.status as OrderStatus;

    order.status = OrderStatus.CANCELLED;
    const updatedOrder = await this.ordersRepository.save(order);

    void this.sendOrderStatusNotificationEmail(
      updatedOrder,
      currentStatus,
      null,
    ).catch((error: unknown) => {
      this.logger.error(
        `Order cancellation email failed for order #${orderId}`,
        error instanceof Error ? error.stack : String(error),
      );
    });

    return updatedOrder;
  }

  async placeOrder(placeOrderDto: PlaceOrderDto): Promise<PlaceOrderResponse> {
    const orderNumber = `OMG-${randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase()}`;

    const productIds = placeOrderDto.items.map((item) => item.productId);
    const products = await this.productsRepository.find({
      where: { productId: In(productIds) },
    });

    if (products.length !== productIds.length) {
      throw new NotFoundException('One or more products not found');
    }

    const productMap = new Map(products.map((p) => [p.productId, p]));

    const createdOrders: OrdersTbl[] = [];
    for (let index = 0; index < placeOrderDto.items.length; index++) {
      const item = placeOrderDto.items[index];
      const isFirstItem = index === 0;

      const product = productMap.get(item.productId);
      if (!product) {
        throw new NotFoundException(`Product ${item.productId} not found`);
      }
      const unitPrice = item.unitPrice ?? product.productPrice;

      const order = this.ordersRepository.create({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: unitPrice,
        totalPrice: item.quantity * unitPrice,
        orderNumber,
        userId: placeOrderDto.userId,
        status: OrderStatus.PENDING_APPROVAL,
        deliveryStatus: 'Pending',
        paymentMethod: placeOrderDto.paymentMethod,
        usePrimaryAddress: isFirstItem
          ? placeOrderDto.delivery.usePrimaryAddress
          : undefined,
        deliveryAddress: isFirstItem ? placeOrderDto.delivery.address : undefined,
        contactPerson: isFirstItem
          ? placeOrderDto.delivery.contactPerson
          : undefined,
        contactNumber: isFirstItem
          ? placeOrderDto.delivery.contactNumber
          : undefined,
        deliveryDate: isFirstItem
          ? placeOrderDto.delivery.deliveryDate
          : undefined,
        deliveryNotes: isFirstItem ? placeOrderDto.delivery.notes : undefined,
        deliveryFee: isFirstItem ? placeOrderDto.deliveryFee : undefined,
        grandTotal: isFirstItem ? placeOrderDto.grandTotal : undefined,
      });
      const savedOrder = await this.ordersRepository.save(order);
      this.logger.log(`Order saved: ${JSON.stringify(savedOrder)}`);
      try {
        const invoice =
          await this.invoicesService.createInvoiceForOrder(savedOrder);
        this.logger.log(
          `Invoice created for orderId ${savedOrder.orderId}: ${JSON.stringify(invoice)}`,
        );
      } catch (err: any) {
        this.logger.error(
          `Failed to create invoice for orderId ${savedOrder.orderId}: ${err}`,
        );
      }
      createdOrders.push(savedOrder);
    }

    try {
      const customer = await this.usersRepository.findOne({
        where: { userId: placeOrderDto.userId },
      });

      const adminUserId = 1;

      await this.notificationsService.createNotification({
        userId: adminUserId,
        type: 'new_order',
        title: 'New Order Received',
        message: `New order placed by ${customer?.companyName || `Customer #${placeOrderDto.userId}`}.

Order Number: ${orderNumber}
Items: ${placeOrderDto.items.length}
Total: PHP ${placeOrderDto.grandTotal?.toLocaleString()}`,
        orderId: createdOrders[0]?.orderId,
        metadata: JSON.stringify({
          customerName: customer?.companyName,
          orderNumber,
          itemCount: placeOrderDto.items.length,
          totalPrice: placeOrderDto.grandTotal,
        }),
      });
    } catch (err: any) {
      this.logger.warn(
        `Failed to create admin notification for order ${orderNumber}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }

    return {
      success: true,
      orderNumber,
      message: `Order placed successfully with ${createdOrders.length} item(s)`,
      orderId: createdOrders[0]?.orderId,
      createdAt: new Date(),
    };
  }

  private assertTransitionAllowed(
    currentStatus: OrderStatus,
    nextStatus: OrderStatus,
  ) {
    if (
      nextStatus === OrderStatus.CANCELLED ||
      nextStatus === OrderStatus.REJECTED
    ) {
      return;
    }

    const allowedNextStatuses = this.validTransitions[currentStatus] ?? [];

    if (!allowedNextStatuses.includes(nextStatus)) {
      throw new BadRequestException(
        `Invalid order status transition from ${currentStatus} to ${nextStatus}`,
      );
    }
  }

  private async sendOrderStatusNotificationEmail(
    order: OrdersTbl,
    previousStatus: OrderStatus,
    invoiceHint?: InvoicesTbl | null,
  ) {
    const user = await this.usersRepository.findOne({
      where: { userId: order.userId },
    });

    if (!user?.emailAddress) {
      this.logger.warn(
        `Skipped order status email for order #${order.orderId}: user email not found.`,
      );
      return;
    }

    let invoice = invoiceHint ?? null;
    if (!invoice) {
      invoice = await this.invoicesService.getInvoiceByOrderId(order.orderId);
    }

    const statusLabel = this.formatStatus(order.status);
    const previousStatusLabel = this.formatStatus(previousStatus);
    const statusMessage = this.getStatusMessage(order.status as OrderStatus);
    const paymentLine = invoice
      ? `Invoice ${invoice.invoiceNumber} is currently ${invoice.paymentStatus}.`
      : 'Invoice details will be shared once billing is generated.';

    await this.mailerService.sendMail({
      to: user.emailAddress,
      subject: `Order #${order.orderId} update: ${statusLabel}`,
      text: [
        `Hi ${user.firstName},`,
        '',
        `Your order #${order.orderId} status changed from ${previousStatusLabel} to ${statusLabel}.`,
        statusMessage,
        '',
        `Order Total: ${Number(order.totalPrice).toFixed(2)}`,
        paymentLine,
        invoice?.dueDate
          ? `Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`
          : '',
        '',
        'Regards,',
        'Synchores Team',
      ]
        .filter(Boolean)
        .join('\n'),
      html: this.buildOrderStatusEmailHtml({
        firstName: user.firstName,
        orderId: order.orderId,
        previousStatus: previousStatusLabel,
        currentStatus: statusLabel,
        statusMessage,
        totalPrice: Number(order.totalPrice),
        invoiceNumber: invoice?.invoiceNumber,
        paymentStatus: invoice?.paymentStatus,
        dueDate: invoice?.dueDate,
      }),
    });
  }

  private getStatusMessage(status: OrderStatus) {
    switch (status) {
      case OrderStatus.PENDING_APPROVAL:
        return 'Your request is waiting for admin review.';
      case OrderStatus.ACCEPT:
        return 'Good news: your order has been approved and ready for packing.';
      case OrderStatus.REJECTED:
        return 'Your order was not approved. Our team can help with alternatives.';
      case OrderStatus.PACKING:
        return 'Your order is being packed and prepared for shipment.';
      case OrderStatus.IN_TRANSIT:
        return 'Your order is on its way to you!';
      case OrderStatus.DELIVERED:
        return 'Your order has been delivered. Thank you for choosing Synchores.';
      default:
        return 'Your order has been updated.';
    }
  }

  private formatStatus(status: string) {
    return status
      .toLowerCase()
      .split('_')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ');
  }

  private buildOrderStatusEmailHtml(params: {
    firstName: string;
    orderId: number;
    previousStatus: string;
    currentStatus: string;
    statusMessage: string;
    totalPrice: number;
    invoiceNumber?: string;
    paymentStatus?: string;
    dueDate?: Date;
  }) {
    const dueDate = params.dueDate
      ? new Date(params.dueDate).toLocaleDateString()
      : 'TBD';

    return `
<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f5f7fb;font-family:Arial,sans-serif;color:#0f172a;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="620" cellspacing="0" cellpadding="0" style="max-width:620px;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
            <tr>
              <td style="background:#0f172a;padding:20px 24px;">
                <p style="margin:0;color:#93c5fd;font-size:12px;letter-spacing:.08em;text-transform:uppercase;">Synchores</p>
                <h1 style="margin:8px 0 0 0;color:#ffffff;font-size:20px;line-height:1.3;">Order Status Updated</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 24px;">
                <p style="margin:0 0 12px 0;font-size:14px;color:#334155;">Hi <strong>${this.escapeHtml(params.firstName)}</strong>,</p>
                <p style="margin:0 0 14px 0;font-size:14px;color:#334155;line-height:1.6;">Your order <strong>#${params.orderId}</strong> moved from <strong>${this.escapeHtml(params.previousStatus)}</strong> to <strong>${this.escapeHtml(params.currentStatus)}</strong>.</p>
                <p style="margin:0 0 16px 0;font-size:14px;color:#0f172a;">${this.escapeHtml(params.statusMessage)}</p>

                <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px;">
                  <p style="margin:0 0 8px 0;font-size:12px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#64748b;">Order Summary</p>
                  <p style="margin:0 0 6px 0;font-size:14px;color:#0f172a;"><strong>Total:</strong> ${params.totalPrice.toFixed(2)}</p>
                  <p style="margin:0 0 6px 0;font-size:14px;color:#0f172a;"><strong>Invoice:</strong> ${this.escapeHtml(params.invoiceNumber ?? 'Pending')}</p>
                  <p style="margin:0 0 6px 0;font-size:14px;color:#0f172a;"><strong>Payment Status:</strong> ${this.escapeHtml(params.paymentStatus ?? 'Pending')}</p>
                  <p style="margin:0;font-size:14px;color:#0f172a;"><strong>Due Date:</strong> ${this.escapeHtml(dueDate)}</p>
                </div>

                <p style="margin:16px 0 0 0;font-size:13px;color:#64748b;">Please check your client portal for the latest order details.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
  }

  private escapeHtml(value: string) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  private async getOrderGroupFromOrderId(orderId: number): Promise<{
    targetOrder: OrdersTbl;
    groupedOrders: OrdersTbl[];
  }> {
    const targetOrder = await this.ordersRepository.findOne({
      where: { orderId },
    });
    if (!targetOrder) {
      throw new NotFoundException('Order not found');
    }

    const groupedOrders = await this.getOrdersInGroup(targetOrder);
    return {
      targetOrder,
      groupedOrders,
    };
  }

  private async getOrdersInGroup(targetOrder: OrdersTbl): Promise<OrdersTbl[]> {
    if (!targetOrder.orderNumber) {
      return [targetOrder];
    }

    const groupedOrders = await this.ordersRepository.find({
      where: { orderNumber: targetOrder.orderNumber },
      order: { orderId: 'ASC' },
    });

    return groupedOrders.length > 0 ? groupedOrders : [targetOrder];
  }

  async savePaymentProof(orderId: number, filename: string): Promise<OrdersTbl> {
    const order = await this.ordersRepository.findOne({
      where: { orderId },
      relations: { user: true },
    });

    if (!order) {
      throw new NotFoundException(`Order #${orderId} not found`);
    }

    const groupedOrders = await this.getOrdersInGroup(order);

    for (const groupedOrder of groupedOrders) {
      groupedOrder.paymentProofImage = filename;
      groupedOrder.paymentProofUploadedAt = new Date();

      if (groupedOrder.paymentProofStatus === 'rejected') {
        groupedOrder.paymentProofStatus = 'pending';
        groupedOrder.paymentProofRejectionReason = undefined;
      }

      const status = groupedOrder.status as OrderStatus;
      if (
        status === OrderStatus.READY_FOR_BILLING ||
        status === OrderStatus.PENDING_APPROVAL
      ) {
        groupedOrder.status = OrderStatus.AWAITING_PAYMENT_VERIFICATION;
      }
    }

    const previousStatus = order.status as OrderStatus;
    const updatedOrders = await this.ordersRepository.save(groupedOrders);
    const updatedOrder =
      updatedOrders.find((o) => o.orderId === order.orderId) ??
      updatedOrders[0];

    let invoice: InvoicesTbl | null = null;
    if (previousStatus === OrderStatus.READY_FOR_BILLING) {
      try {
        invoice =
          await this.invoicesService.createInvoiceForOrder(updatedOrder);
      } catch (error: any) {
        this.logger.warn(
          `Invoice creation skipped for order #${orderId}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    void this.sendPaymentProofReceivedEmail(
      { ...updatedOrder, user: order.user },
      invoice || undefined,
    ).catch((error: unknown) => {
      this.logger.error(
        `Payment proof notification email failed for order #${orderId}`,
        error instanceof Error ? error.stack : String(error),
      );
    });

    return updatedOrder;
  }

  private async sendPaymentProofReceivedEmail(
    order: OrdersTbl & { user?: UsersTbl },
    invoice?: InvoicesTbl,
  ): Promise<void> {
    if (!order.user) {
      this.logger.warn(`No user found for order #${order.orderId}`);
      return;
    }
    const user = order.user;

    const invoiceLine = invoice
      ? `Invoice ${invoice.invoiceNumber} has been created and is available for download.`
      : 'Your invoice details will be shared soon.';

    await this.mailerService.sendMail({
      to: user.emailAddress,
      subject: `Payment Proof Received - Order #${order.orderId}`,
      text: [
        `Hi ${user.firstName},`,
        '',
        `We have received your payment proof for Order #${order.orderId}.`,
        'Our team will verify the payment shortly.',
        '',
        `Order Total: ${Number(order.totalPrice).toFixed(2)}`,
        invoiceLine,
        '',
        'Thank you for your business!',
        'Regards,',
        'Synchores Team',
      ]
        .filter(Boolean)
        .join('\n'),
      html: this.buildPaymentProofEmailHtml({
        firstName: user.firstName,
        orderId: order.orderId,
        totalPrice: Number(order.totalPrice),
        invoiceNumber: invoice?.invoiceNumber,
        invoiceStatus: invoice?.paymentStatus,
      }),
    });
  }

  private buildPaymentProofEmailHtml(data: {
    firstName: string;
    orderId: number;
    totalPrice: number;
    invoiceNumber?: string;
    invoiceStatus?: string;
  }): string {
    return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { font-family: Arial, sans-serif; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: #bf262f; color: white; padding: 20px; text-align: center; border-radius: 5px; }
      .content { padding: 20px; background: #f9f9f9; margin-top: 20px; border-radius: 5px; }
      .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      .highlight { color: #bf262f; font-weight: bold; }
      .info-box { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #bf262f; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Payment Proof Received</h1>
      </div>

      <div class="content">
        <p>Hi <strong>${this.escapeHtml(data.firstName)}</strong>,</p>

        <p>Thank you for submitting your payment proof for <span class="highlight">Order #${data.orderId}</span>.</p>

        <div class="info-box">
          <strong>Order Details</strong><br>
          Order ID: ${data.orderId}<br>
          Amount: PHP ${data.totalPrice.toLocaleString('en-PH', { minimumFractionDigits: 2 })}<br>
          ${data.invoiceNumber ? `Invoice: ${data.invoiceNumber}<br>` : ''}
          ${data.invoiceStatus ? `Status: ${data.invoiceStatus}` : ''}
        </div>

        <p>Our team will verify your payment shortly. You'll receive a confirmation email once the verification is complete.</p>

        <p style="color: #666; font-size: 14px;">
          <strong>What happens next?</strong><br>
          • We verify your payment proof<br>
          • Order status updates to "Processing"<br>
          • Items will be prepared for dispatch<br>
          • You'll receive tracking information
        </p>
      </div>

      <div class="footer">
        <p>&copy; 2026 Synchores. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>`;
  }

  private async sendPaymentProofRejectedEmail(order: OrdersTbl): Promise<void> {
    if (!order.user && !order.userId) {
      this.logger.warn(`No user found for order #${order.orderId}`);
      return;
    }

    let user: UsersTbl | null = order.user || null;
    if (!user && order.userId) {
      user = await this.usersRepository.findOne({
        where: { userId: order.userId },
      });
    }

    if (!user) {
      this.logger.warn(`User not found for order #${order.orderId}`);
      return;
    }

    const attemptsLeft = 3 - order.paymentProofAttempts;
    const isAutoRejected = order.paymentProofAttempts >= 3;

    await this.mailerService.sendMail({
      to: user.emailAddress,
      subject: isAutoRejected
        ? `Order #${order.orderId} Cancelled - Payment Issues`
        : `Payment Proof Rejected - Order #${order.orderId}`,
      text: [
        `Hi ${user.firstName},`,
        '',
        isAutoRejected
          ? `Your order #${order.orderId} has been cancelled after 3 failed payment proof submission attempts.`
          : `Your payment proof for Order #${order.orderId} was rejected.`,
        '',
        `Reason: ${order.paymentProofRejectionReason}`,
        '',
        isAutoRejected
          ? `Please contact our support team at support@synchores.com to place a new order.`
          : `You have ${attemptsLeft} more attempt(s) to upload valid payment proof before the order is automatically cancelled.`,
        '',
        `Order Total: ${Number(order.totalPrice).toFixed(2)}`,
        '',
        'Please review the requirements and submit a new payment proof.',
        '',
        'Regards,',
        'Synchores Team',
      ]
        .filter(Boolean)
        .join('\n'),
      html: this.buildPaymentProofRejectedEmailHtml({
        firstName: user.firstName,
        orderId: order.orderId,
        totalPrice: Number(order.totalPrice),
        rejectionReason:
          order.paymentProofRejectionReason ||
          'Invalid or unclear payment proof',
        attemptsLeft,
        isAutoRejected,
      }),
    });
  }

  private buildPaymentProofRejectedEmailHtml(data: {
    firstName: string;
    orderId: number;
    totalPrice: number;
    rejectionReason: string;
    attemptsLeft: number;
    isAutoRejected: boolean;
  }): string {
    return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { font-family: Arial, sans-serif; color: #333; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: ${data.isAutoRejected ? '#dc2626' : '#f97316'}; color: white; padding: 20px; text-align: center; border-radius: 5px; }
      .content { padding: 20px; background: #fef5f5; margin-top: 20px; border-radius: 5px; }
      .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
      .warning-box { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #dc2626; }
      .info-box { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #f97316; }
      .highlight { color: #bf262f; font-weight: bold; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>${data.isAutoRejected ? 'Order Cancelled' : 'Payment Proof Rejected'}</h1>
      </div>

      <div class="content">
        <p>Hi <strong>${this.escapeHtml(data.firstName)}</strong>,</p>

        <p>${data.isAutoRejected ? `Unfortunately, your order #<span class="highlight">${data.orderId}</span> has been cancelled due to 3 failed payment proof submissions.` : `Your payment proof for order <span class="highlight">#${data.orderId}</span> was not accepted.`}</p>

        <div class="${data.isAutoRejected ? 'warning-box' : 'info-box'}">
          <strong>Reason for Rejection:</strong><br>
          ${this.escapeHtml(data.rejectionReason)}
        </div>

        ${!data.isAutoRejected ? `<p><strong>Action Required:</strong><br>You have <span class="highlight">${data.attemptsLeft} attempt(s)</span> remaining to submit a valid payment proof. After 3 failed attempts, the order will be automatically cancelled.</p>` : ''}

        <div class="info-box">
          <strong>Order Details</strong><br>
          Order ID: ${data.orderId}<br>
          Amount: PHP ${data.totalPrice.toLocaleString('en-PH', { minimumFractionDigits: 2 })}<br>
          Status: ${data.isAutoRejected ? 'Cancelled' : 'Awaiting Payment Verification'}
        </div>

        <p style="color: #666; font-size: 14px;">
          <strong>${data.isAutoRejected ? 'What happens next?' : 'Please provide a clear payment proof that shows:'}</strong><br>
          ${
            data.isAutoRejected
              ? '• You can place a new order anytime<br>• Contact us at support@synchores.com for assistance<br>• Keep your previous order number for reference'
              : '• Clear receipt or transaction confirmation<br>• Date and amount of payment<br>• Reference number (if applicable)<br>• All text should be legible'
          }
        </p>
      </div>

      <div class="footer">
        <p>&copy; 2026 Synchores. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>`;
  }

  async initiatePaymongoCheckout(orderId: number): Promise<{
    paymentIntentId: string;
    checkoutUrl: string;
    message: string;
  }> {
    const order = await this.ordersRepository.findOne({ where: { orderId } });
    if (!order) {
      throw new NotFoundException(`Order #${orderId} not found`);
    }

    this.logger.debug(
      `Order retrieved: orderId=${order.orderId}, grandTotal=${order.grandTotal}, totalPrice=${order.totalPrice}, deliveryFee=${order.deliveryFee}`,
    );

    const totalAmount =
      order.grandTotal || order.totalPrice + (order.deliveryFee || 0);

    this.logger.debug(`Calculated totalAmount: ${totalAmount}`);

    if (totalAmount <= 0 || isNaN(totalAmount)) {
      this.logger.error(
        `Invalid order amount calculation: grandTotal=${order.grandTotal}, totalPrice=${order.totalPrice}, deliveryFee=${order.deliveryFee}, computed=${totalAmount}`,
      );
      throw new BadRequestException(
        `Invalid order amount: PHP ${totalAmount}`,
      );
    }

    this.logger.log(
      `Initiating PayMongo checkout for Order #${orderId}, Amount: PHP ${totalAmount}`,
    );

    try {
      const result = await this.paymongoService.createCheckoutLink(
        totalAmount,
        orderId,
        `Order #${order.orderId} - ${order.orderNumber || 'Unnamed'}`,
        order.orderNumber,
        totalAmount,
      );

      order.paymentIntentId = result.checkoutId;
      order.paymentStatus = 'PENDING';
      await this.ordersRepository.save(order);

      this.logger.log(
        `PayMongo checkout initiated for Order #${orderId}: ${result.checkoutId}`,
      );

      return {
        paymentIntentId: result.checkoutId,
        checkoutUrl: result.checkoutUrl,
        message: `Checkout session created. Redirect to: ${result.checkoutUrl}`,
      };
    } catch (error) {
      this.logger.error(
        `Failed to initiate PayMongo checkout for Order #${orderId}:`,
        error as Error,
      );
      throw error;
    }
  }

  async updatePaymentStatus(
    orderId: number,
    paymentStatus: 'PAID' | 'FAILED' | 'PENDING',
    paymentIntentId?: string,
  ): Promise<OrdersTbl> {
    const order = await this.ordersRepository.findOne({ where: { orderId } });
    if (!order) {
      throw new NotFoundException(`Order #${orderId} not found`);
    }

    order.paymentStatus = paymentStatus;

    if (paymentIntentId) {
      order.paymentIntentId = paymentIntentId;
    }

    const updatedOrder = await this.ordersRepository.save(order);

    if (paymentStatus === 'PAID') {
      try {
        await this.invoicesService.payInvoiceByOrderId(orderId);
        this.logger.log(`Invoice updated to PAID for Order #${orderId}`);
      } catch (err) {
        this.logger.error(
          `Failed to update invoice for Order #${orderId}:`,
          err as Error,
        );
      }
    }

    return updatedOrder;
  }

  async confirmPaymongoPayment(orderId: number): Promise<OrdersTbl> {
    const { targetOrder, groupedOrders } = await this.getOrderGroupFromOrderId(
      orderId,
    );

    const primaryOrder =
      groupedOrders.find((o) => o.grandTotal != null || o.deliveryFee != null) ||
      targetOrder;

    const subtotal = groupedOrders.reduce(
      (sum, item) => sum + Number(item.totalPrice || 0),
      0,
    );
    const computedAmount =
      Number(primaryOrder.grandTotal) ||
      subtotal + Number(primaryOrder.deliveryFee || 0);

    const transactionId =
      primaryOrder.paymentIntentId ||
      targetOrder.paymentIntentId ||
      `PAYMONGO-${primaryOrder.orderNumber ?? orderId}`;
    const timestamp = new Date();

    for (const groupedOrder of groupedOrders) {
      groupedOrder.paymentStatus = 'PAID';
      groupedOrder.status = OrderStatus.AWAITING_PAYMENT_VERIFICATION;
      groupedOrder.paymongoAmount = computedAmount;
      groupedOrder.paymongoTransactionId = transactionId;
      groupedOrder.paymongoPaymentMethod =
        groupedOrder.paymongoPaymentMethod || 'card';
      groupedOrder.paymongoTimestamp = timestamp;
    }

    const updatedOrders = await this.ordersRepository.save(groupedOrders);
    const updatedOrder =
      updatedOrders.find((o) => o.orderId === targetOrder.orderId) ||
      updatedOrders[0];

    try {
      await this.invoicesService.payInvoiceByOrderId(orderId);
      this.logger.log(
        `Order #${orderId} payment confirmed via PayMongo. Status: AWAITING_PAYMENT_VERIFICATION`,
      );
    } catch (err) {
      this.logger.error(`Failed to update invoice for Order #${orderId}:`, err as Error);
    }

    return updatedOrder;
  }
}
