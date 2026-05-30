import { IsInt, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsInt()
  userId: number;

  @IsNotEmpty()
  @IsString()
  type:
    | 'payment_proof_rejected'
    | 'payment_proof_approved'
    | 'order_status_change'
    | 'new_order'
    | 'general';

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsInt()
  orderId?: number;

  @IsOptional()
  @IsString()
  metadata?: string;
}
