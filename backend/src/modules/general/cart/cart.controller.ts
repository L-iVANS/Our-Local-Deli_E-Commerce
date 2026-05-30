import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { CartService } from './cart.service';
import { AddToCartInput, UpdateCartItemInput } from './cart.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getCart(@Req() req: Request) {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new Error('Unauthorized: User ID not found in request');
    }
    return await this.cartService.getCart(userId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async addToCart(@Req() req: Request, @Body() input: AddToCartInput) {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new Error('Unauthorized: User ID not found in request');
    }
    return await this.cartService.addToCart(userId, input);
  }

  @Patch('items/:id')
  @UseGuards(JwtAuthGuard)
  async updateCartItem(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateCartItemInput,
  ) {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new Error('Unauthorized: User ID not found in request');
    }
    return await this.cartService.updateCartItem(userId, { ...input, id });
  }

  @Delete('items/:id')
  @UseGuards(JwtAuthGuard)
  async removeFromCart(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new Error('Unauthorized: User ID not found in request');
    }
    await this.cartService.removeFromCart(userId, id);
    return { success: true };
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async clearCart(@Req() req: Request) {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new Error('Unauthorized: User ID not found in request');
    }
    await this.cartService.clearCart(userId);
    return { success: true };
  }

  @Delete('items/by-product/:productId')
  @UseGuards(JwtAuthGuard)
  async removeCartItemByProductId(
    @Req() req: Request,
    @Param('productId', ParseIntPipe) productId: number,
  ) {
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new Error('Unauthorized: User ID not found in request');
    }
    await this.cartService.removeByProductId(userId, productId);
    return { success: true };
  }
}
