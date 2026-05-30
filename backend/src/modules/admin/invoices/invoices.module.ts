import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesTbl } from './entity/invoices.tbl';
import { OrdersTbl } from '../orders/entity/orders.tbl';
import { PaymentsTbl } from '../payments/entity/payments.tbl';
import { UsersTbl } from '../../general/auth/entity/users.tbl';
import { InvoicesService } from './invoices.service';
import { InvoicesController } from './invoices.controller';
import { AuthModule } from '../../general/auth/auth.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([InvoicesTbl, OrdersTbl, PaymentsTbl, UsersTbl]),
    AuthModule,
    forwardRef(() => OrdersModule),
  ],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService],
})
export class InvoicesModule {}
