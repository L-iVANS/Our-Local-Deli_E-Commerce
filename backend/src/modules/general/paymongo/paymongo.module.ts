import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PaymongoController } from './paymongo.controller';
import { PaymongoService } from './paymongo.service';
import { OrdersModule } from '../../admin/orders/orders.module';

@Module({
  imports: [
    ConfigModule,
    forwardRef(() => OrdersModule), // ✅ required so PaymongoService can inject OrdersService
  ],
  controllers: [PaymongoController],
  providers: [PaymongoService],
  exports: [PaymongoService],
})
export class PaymongoModule {}