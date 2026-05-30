import { PartialType } from '@nestjs/mapped-types';
import { IsNumber } from 'class-validator';
import { CreateOrderDto } from './create.order';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsNumber()
  orderId: number;
}
