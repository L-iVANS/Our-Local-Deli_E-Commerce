import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
  declare id: number;

  @Column()
  declare userId: number;

  @Column()
  declare productId: number;

  @Column()
  declare quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  declare unitPrice: number;

  @Column({ nullable: true })
  selectedColor?: string;

  @Column({ nullable: true })
  selectedSize?: string;

  @CreateDateColumn()
  declare createdAt: Date;

  @UpdateDateColumn()
  declare updatedAt: Date;
}

export class AddToCartInput {
  @IsInt()
  @Min(1)
  declare productId: number;

  @IsInt()
  @Min(1)
  declare quantity: number;

  @IsNumber()
  @Min(0)
  declare unitPrice: number;

  @IsOptional()
  @IsString()
  selectedColor?: string;

  @IsOptional()
  @IsString()
  selectedSize?: string;
}

export class UpdateCartItemInput {
  @IsInt()
  @Min(1)
  declare id: number;

  @IsInt()
  @Min(1)
  declare quantity: number;
}

export class CartResponse {
  declare items: CartItem[];
  declare totalItems: number;
  declare totalPrice: number;
}
