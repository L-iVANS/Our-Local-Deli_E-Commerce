import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  IsInt,
  IsOptional,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  productName: string;

  @IsOptional()
  @IsString()
  productDescription?: string;

  @IsNotEmpty()
  @IsString()
  sku: string;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  productPrice: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  reorderPoint: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  available: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  inTransit?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  blocked?: number;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
