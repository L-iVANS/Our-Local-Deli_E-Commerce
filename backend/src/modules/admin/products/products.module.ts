import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsTbl } from './entity/products.tbl';
import { CategoriesTbl } from '../categories/entity/categories.tbl';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { ProductImageController } from './product-image.controller';
import { AuthModule } from '../../general/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductsTbl, CategoriesTbl]), AuthModule],
  controllers: [ProductsController, ProductImageController],
  providers: [ProductsService],
})
export class ProductsModule {}
