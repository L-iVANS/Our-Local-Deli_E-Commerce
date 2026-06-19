import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersTbl } from '../src/modules/general/auth/entity/users.tbl';
import { OrdersTbl } from '../src/modules/admin/orders/entity/orders.tbl';
import { InvoicesTbl } from '../src/modules/admin/invoices/entity/invoices.tbl';
import { ProductsTbl } from '../src/modules/admin/products/entity/products.tbl';
import { PaymentsTbl } from '../src/modules/admin/payments/entity/payments.tbl';
import { CartItem } from '../src/modules/general/cart/entity/cart.entity';
import { CategoriesTbl } from '../src/modules/admin/categories/entity/categories.tbl';
import { NotificationsTbl } from '../src/modules/general/notifications/entity/notifications.tbl';
import { NavBarTbl } from '../src/modules/admin/cms/entities/nav-bar-tbl';
import { NavLinksTbl } from '../src/modules/admin/cms/entities/nav-links-tbl';
import { TiktokCarouselsTbl } from '../src/modules/admin/cms/entities/tiktok-carousels-tbl';
import { TiktokVideosTbl } from '../src/modules/admin/cms/entities/tiktok-videos-tbl';
import { CategoriesTbl as CmsCategoriesTbl } from '../src/modules/admin/cms/entities/categories-tbl';

export const DatabaseConfig = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    type: 'postgres',
    host: config.get<string>('DB_HOST') ?? 'localhost',
    port: Number(config.get<string>('DB_PORT') ?? '5432'),
    username: config.get<string>('DB_USER') ?? config.get<string>('POSTGRES_USER') ?? 'postgres',
    password:
      config.get<string>('DB_PASSWORD') ??
      config.get<string>('POSTGRES_PASSWORD') ??
      config.get<string>('POSTGRES_ROOT_PASSWORD'),
    database: config.get<string>('DB_NAME') ?? config.get<string>('POSTGRES_DATABASE'),
    entities: [
      UsersTbl,
      OrdersTbl,
      InvoicesTbl,
      ProductsTbl,
      PaymentsTbl,
      CartItem,
      CategoriesTbl,
      NotificationsTbl,
      NavBarTbl,
      NavLinksTbl,
      TiktokCarouselsTbl,
      TiktokVideosTbl,
      CmsCategoriesTbl,
    ],
    synchronize: config.get<string>('DB_SYNC') === 'true',
  }),
});
