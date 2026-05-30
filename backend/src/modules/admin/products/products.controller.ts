import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create.products';
import { UpdateProductDto } from './dto/update.products';
import { JwtAuthGuard } from '../../general/auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../general/auth/guards/roles.guard';

@Controller('admin/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async readProducts() {
    return await this.productsService.readProducts();
  }

  @Get('by-name/:productName')
  async readProductByName(@Param('productName') productName: string) {
    return await this.productsService.readProductByName(productName);
  }

  @Get(':productId')
  async readProductById(@Param('productId', ParseIntPipe) productId: number) {
    return await this.productsService.readProductById(productId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createProduct(@Body() input: CreateProductDto) {
    return await this.productsService.createProduct(input);
  }

  @Patch(':productId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateProduct(
    @Param('productId', ParseIntPipe) productId: number,
    @Body() input: UpdateProductDto,
  ) {
    return await this.productsService.updateProduct(productId, input);
  }

  @Delete(':productId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteProduct(
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    return await this.productsService.deleteProduct(productId);
  }
}
