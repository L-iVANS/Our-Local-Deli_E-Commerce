import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriesTbl } from './entity/categories.tbl';
import { ProductsTbl } from '../products/entity/products.tbl';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { AuthModule } from '../../general/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriesTbl, ProductsTbl]), AuthModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
})
export class CategoriesModule {}
