import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseConfig } from '../config/db.config';
import { AuthModule } from './modules/general/auth/auth.module';
import { CategoriesModule } from './modules/admin/categories/categories.module';
import { ProductsModule } from './modules/admin/products/products.module';
import { OrdersModule } from './modules/admin/orders/orders.module';
import { UsersCrudModule } from './modules/admin/users-crud/users-crud.module';
import { InvoicesModule } from './modules/admin/invoices/invoices.module';
import { PaymentsModule } from './modules/admin/payments/payments.module';
import { CmsModule } from './modules/admin/cms/cms.module';
import { NotificationsModule } from './modules/general/notifications/notifications.module';
import { CartModule } from './modules/general/cart/cart.module';
import { MailerModule } from './modules/general/mailer/mailer.module';
import { PaymongoModule } from './modules/general/paymongo/paymongo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),
    DatabaseConfig,
    AuthModule,
    CartModule,
    UsersCrudModule,
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    InvoicesModule,
    PaymentsModule,
    CmsModule,
    NotificationsModule,
    MailerModule,
    PaymongoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
