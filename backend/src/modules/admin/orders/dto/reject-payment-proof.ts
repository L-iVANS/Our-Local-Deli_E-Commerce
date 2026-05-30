import { IsInt, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class RejectPaymentProofDto {
  @IsNotEmpty()
  @IsInt()
  orderId: number;

  @IsNotEmpty()
  @IsString()
  @MinLength(10, { message: 'Rejection reason must be at least 10 characters' })
  rejectionReason: string;
}
