import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create.categories';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  categoryId?: number;
}
