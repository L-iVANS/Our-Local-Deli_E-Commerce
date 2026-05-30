import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoicesTbl } from './entity/invoices.tbl';
import { OrdersTbl } from '../orders/entity/orders.tbl';
import { PaymentsTbl } from '../payments/entity/payments.tbl';
import { UsersTbl } from '../../general/auth/entity/users.tbl';
import { MailerService } from '../../general/mailer/mailer.service';

@Injectable()
export class InvoicesService {
  private readonly logger = new Logger(InvoicesService.name);

  constructor(
    @InjectRepository(InvoicesTbl)
    private readonly invoicesRepository: Repository<InvoicesTbl>,
    @InjectRepository(OrdersTbl)
    private readonly ordersRepository: Repository<OrdersTbl>,
    @InjectRepository(PaymentsTbl)
    private readonly paymentsRepository: Repository<PaymentsTbl>,
    @InjectRepository(UsersTbl)
    private readonly usersRepository: Repository<UsersTbl>,
    private readonly mailerService: MailerService,
  ) {}

  async getInvoiceByOrderId(orderId: number) {
    return this.invoicesRepository.findOne({ where: { orderId } });
  }

  async getAllInvoices() {
    return this.invoicesRepository.find({
      relations: { order: true, user: true },
      order: { createdAt: 'DESC' },
    });
  }

  async createInvoiceForOrder(order: OrdersTbl) {
    const existingInvoice = await this.getInvoiceByOrderId(order.orderId);
    if (existingInvoice) {
      return existingInvoice;
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    const invoice = this.invoicesRepository.create({
      orderId: order.orderId,
      userId: order.userId,
      invoiceNumber: this.generateInvoiceNumber(order.orderId),
      totalAmount: order.totalPrice,
      dueDate,
      paymentStatus: 'UNPAID',
    });

    return this.invoicesRepository.save(invoice);
  }

  async payInvoiceByOrderId(orderId: number) {
    const invoice = await this.invoicesRepository.findOne({
      where: { orderId },
    });
    if (!invoice) {
      throw new NotFoundException(`Invoice for order ${orderId} not found`);
    }

    const order = await this.ordersRepository.findOne({ where: { orderId } });
    if (!order) {
      throw new NotFoundException(`Order ${orderId} not found`);
    }

    if (String(invoice.paymentStatus).toUpperCase() === 'PAID') {
      return invoice;
    }

    invoice.paymentStatus = 'PAID';
    const savedInvoice = await this.invoicesRepository.save(invoice);

    const paymentReference = this.generatePaymentReference(order.orderId);
    const payment = this.paymentsRepository.create({
      invoiceId: savedInvoice.invoiceId,
      paymentAmount: Number(savedInvoice.totalAmount),
      paymentReference,
      paymentDate: new Date(),
    });
    await this.paymentsRepository.save(payment);

    void this.sendPaymentConfirmationEmail(order, savedInvoice).catch(
      (error: unknown) => {
        this.logger.error(
          `Payment confirmation email failed for order #${order.orderId}`,
          error instanceof Error ? error.stack : String(error),
        );
      },
    );

    return savedInvoice;
  }

  private generateInvoiceNumber(orderId: number) {
    const timestamp = Date.now().toString().slice(-6);
    return `INV-${orderId}-${timestamp}`;
  }

  private generatePaymentReference(orderId: number) {
    const timestamp = Date.now().toString().slice(-6);
    return `PAY-${orderId}-${timestamp}`;
  }

  private async sendPaymentConfirmationEmail(
    order: OrdersTbl,
    invoice: InvoicesTbl,
  ) {
    const user = await this.usersRepository.findOne({
      where: { userId: order.userId },
    });
    if (!user?.emailAddress) {
      return;
    }

    const dueDate = invoice.dueDate
      ? new Date(invoice.dueDate).toLocaleDateString()
      : 'TBD';

    await this.mailerService.sendMail({
      to: user.emailAddress,
      subject: `Payment received for Order #${order.orderId}`,
      text: [
        `Hi ${user.firstName},`,
        '',
        `We received your payment for order #${order.orderId}.`,
        `Invoice: ${invoice.invoiceNumber}`,
        `Amount: ${Number(invoice.totalAmount).toFixed(2)}`,
        `Status: ${invoice.paymentStatus}`,
        `Due Date: ${dueDate}`,
        '',
        'Thank you for your payment.',
        'Synchores Team',
      ].join('\n'),
      html: `
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
                <h1 style="margin:8px 0 0 0;color:#ffffff;font-size:20px;line-height:1.3;">Payment Received</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:22px 24px;">
                <p style="margin:0 0 12px 0;font-size:14px;color:#334155;">Hi <strong>${this.escapeHtml(user.firstName)}</strong>,</p>
                <p style="margin:0 0 14px 0;font-size:14px;color:#334155;line-height:1.6;">Your payment for order <strong>#${order.orderId}</strong> has been confirmed.</p>
                <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:14px;">
                  <p style="margin:0 0 6px 0;font-size:14px;color:#0f172a;"><strong>Invoice:</strong> ${this.escapeHtml(invoice.invoiceNumber)}</p>
                  <p style="margin:0 0 6px 0;font-size:14px;color:#0f172a;"><strong>Amount:</strong> ${Number(invoice.totalAmount).toFixed(2)}</p>
                  <p style="margin:0 0 6px 0;font-size:14px;color:#0f172a;"><strong>Payment Status:</strong> ${this.escapeHtml(invoice.paymentStatus)}</p>
                  <p style="margin:0;font-size:14px;color:#0f172a;"><strong>Due Date:</strong> ${this.escapeHtml(dueDate)}</p>
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`,
    });
  }

  private escapeHtml(value: string) {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}
