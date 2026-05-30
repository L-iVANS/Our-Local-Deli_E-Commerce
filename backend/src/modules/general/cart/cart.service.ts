import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import {
  CartItem,
  AddToCartInput,
  UpdateCartItemInput,
  CartResponse,
} from './cart.entity';
import { ProductsTbl } from '../../admin/products/entity/products.tbl';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartItem)
    private readonly cartRepository: Repository<CartItem>,
    @InjectRepository(ProductsTbl)
    private readonly productRepository: Repository<ProductsTbl>,
  ) {}

  private async getCartItemWithProduct(id: number): Promise<any> {
    const item = await this.cartRepository.findOne({ where: { id } });
    if (!item) return null;

    const product = await this.productRepository.findOne({
      where: { productId: item.productId },
      relations: { category: true },
    });

    return {
      ...item,
      product,
    };
  }

  async getCart(userId: number): Promise<CartResponse> {
    const items = await this.cartRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });

    const itemsWithProducts = await Promise.all(
      items.map(async (item) => {
        const product = await this.productRepository.findOne({
          where: { productId: item.productId },
          relations: { category: true },
        });
        return {
          ...item,
          product,
        } as any;
      }),
    );

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + item.quantity * parseFloat(String(item.unitPrice)),
      0,
    );

    return {
      items: itemsWithProducts,
      totalItems,
      totalPrice,
    };
  }

  async addToCart(userId: number, input: AddToCartInput): Promise<CartItem> {
    try {
      const product = await this.productRepository.findOne({
        where: { productId: input.productId },
      });

      if (!product) {
        throw new BadRequestException(
          `Product with ID ${input.productId} not found`,
        );
      }

      const unitPrice = product.productPrice;

      const where: any = {
        userId,
        productId: input.productId,
      };

      if (input.selectedColor) {
        where.selectedColor = input.selectedColor;
      } else {
        where.selectedColor = IsNull();
      }

      if (input.selectedSize) {
        where.selectedSize = input.selectedSize;
      } else {
        where.selectedSize = IsNull();
      }

      const exists = await this.cartRepository.findOne({ where });

      if (exists) {
        exists.quantity += input.quantity;
        const saved = await this.cartRepository.save(exists);
        const updated = await this.getCartItemWithProduct(saved.id);
        if (!updated) {
          throw new NotFoundException('Failed to retrieve updated cart item');
        }
        return updated;
      }

      const cartItem = this.cartRepository.create({
        userId,
        productId: input.productId,
        quantity: input.quantity,
        unitPrice: unitPrice,
        selectedColor: input.selectedColor,
        selectedSize: input.selectedSize,
      });

      const saved = await this.cartRepository.save(cartItem);

      const created = await this.getCartItemWithProduct(saved.id);
      if (!created) {
        throw new NotFoundException('Failed to retrieve created cart item');
      }
      return created;
    } catch (error: any) {
      throw error;
    }
  }

  async updateCartItem(
    userId: number,
    input: UpdateCartItemInput,
  ): Promise<CartItem> {
    const item = await this.cartRepository.findOne({
      where: { id: input.id, userId },
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    if (input.quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than 0');
    }

    item.quantity = input.quantity;
    const saved = await this.cartRepository.save(item);
    const updated = await this.getCartItemWithProduct(saved.id);
    if (!updated) {
      throw new NotFoundException('Failed to retrieve updated cart item');
    }
    return updated;
  }

  async removeFromCart(userId: number, itemId: number): Promise<void> {
    const result = await this.cartRepository.delete({
      id: itemId,
      userId,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Cart item not found');
    }
  }

  async clearCart(userId: number): Promise<void> {
    await this.cartRepository.delete({ userId });
  }

  async removeByProductId(userId: number, productId: number): Promise<void> {
    await this.cartRepository.delete({ userId, productId });
  }
}
