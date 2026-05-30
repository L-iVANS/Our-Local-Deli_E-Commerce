import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { OrderStatus } from '../entity/order-status.enum';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsInt()
  productId: number;

  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsString()
  orderNumber: string;

  @IsOptional()
  @IsString()
  orderType?: string;

  @IsNotEmpty()
  @IsInt()
  quantity: number;

  @IsNotEmpty()
  @IsNumber()
  unitPrice: number;

  @IsNotEmpty()
  @IsNumber()
  totalPrice: number;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsString()
  deliveryStatus?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  paymentProofImage?: string;

  @IsOptional()
  paymentProofUploadedAt?: Date;

  @IsOptional()
  @IsString()
  paymongoTransactionId?: string;

  @IsOptional()
  @IsNumber()
  paymongoAmount?: number;

  @IsOptional()
  @IsString()
  paymongoPaymentMethod?: string;

  @IsOptional()
  paymongoTimestamp?: Date;
}
