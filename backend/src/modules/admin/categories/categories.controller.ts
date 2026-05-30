import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create.categories';
import { UpdateCategoryDto } from './dto/update.categories';
import { JwtAuthGuard } from '../../general/auth/guards/jwt-auth.guard';
import { RolesGuard, Roles } from '../../general/auth/guards/roles.guard';

@Controller('admin/categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  async readCategories() {
    return await this.categoriesService.readCategories();
  }

  @Get('by-slug/:slug')
  async readCategoryBySlug(@Param('slug') slug: string) {
    return await this.categoriesService.readCategoryBySlug(slug);
  }

  @Get(':categoryId')
  async readCategoryById(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return await this.categoriesService.readCategoryById(categoryId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createCategory(@Body() input: CreateCategoryDto) {
    return await this.categoriesService.createCategory(input);
  }

  @Patch(':categoryId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body() input: UpdateCategoryDto,
  ) {
    return await this.categoriesService.updateCategory(categoryId, input);
  }

  @Delete(':categoryId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return await this.categoriesService.deleteCategory(categoryId);
  }

  @Post('assign-random')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async assignRandomCategoriesToProducts() {
    return await this.categoriesService.assignRandomCategoriesToProducts();
  }
}
