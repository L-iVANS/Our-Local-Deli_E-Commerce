import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create.products';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
