import {
  IsArray,
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class OrderItemInput {
  @IsNotEmpty()
  productId: number;

  @IsNotEmpty()
  quantity: number;

  @IsOptional()
  @IsNumber()
  unitPrice?: number;
}

export class DeliveryDetailsInput {
  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  contactPerson?: string;

  @IsOptional()
  @IsString()
  contactNumber?: string;

  @IsOptional()
  deliveryDate?: Date;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  usePrimaryAddress?: boolean;
}

export class PlaceOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemInput)
  items: OrderItemInput[];

  @ValidateNested()
  @Type(() => DeliveryDetailsInput)
  delivery: DeliveryDetailsInput;

  @IsNumber()
  subtotal: number;

  @IsNumber()
  deliveryFee: number;

  @IsNumber()
  grandTotal: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;

  // @IsOptional()
  // @IsString()
  // companyId?: string;

  @IsNotEmpty()
  @IsString()
  paymentMethod: string;
}
