import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartItem } from './entity/cart.entity';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { ProductsTbl } from '../../admin/products/entity/products.tbl';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([CartItem, ProductsTbl]), AuthModule],
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService],
})
export class CartModule {}
