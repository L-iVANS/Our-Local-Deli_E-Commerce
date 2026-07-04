import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersTbl } from './entity/orders.tbl';
import { ProductsTbl } from '../products/entity/products.tbl';
import { UsersTbl } from '../../general/auth/entity/users.tbl';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PaymentProofController } from './payment-proof.controller';
import { InvoicesModule } from '../invoices/invoices.module';
import { NotificationsModule } from '../../general/notifications/notifications.module';
import { AuthModule } from '../../general/auth/auth.module';
import { PaymongoModule } from '../../general/paymongo/paymongo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrdersTbl, ProductsTbl, UsersTbl]),
    InvoicesModule,
    NotificationsModule,
    AuthModule,
    forwardRef(() => PaymongoModule),
  ],
  controllers: [OrdersController, PaymentProofController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
