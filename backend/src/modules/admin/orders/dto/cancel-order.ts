import { IsInt, IsNotEmpty } from 'class-validator';

export class CancelOrderDto {
  @IsNotEmpty()
  @IsInt()
  orderId: number;
}
