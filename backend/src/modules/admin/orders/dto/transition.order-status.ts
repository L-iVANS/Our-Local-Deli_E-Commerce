import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  MaxLength,
} from 'class-validator';
import { OrderStatus } from '../entity/order-status.enum';

export class TransitionOrderStatusDto {
  @IsNotEmpty()
  @IsInt()
  orderId: number;

  @IsNotEmpty()
  @IsEnum(OrderStatus)
  nextStatus: OrderStatus;

  @IsOptional()
  @MaxLength(200)
  rejectionReason?: string;
}
