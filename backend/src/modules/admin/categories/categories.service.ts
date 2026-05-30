import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesTbl } from './entity/categories.tbl';
import { ProductsTbl } from '../products/entity/products.tbl';
import { CreateCategoryDto } from './dto/create.categories';
import { UpdateCategoryDto } from './dto/update.categories';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesTbl)
    private readonly categoriesRepo: Repository<CategoriesTbl>,
    @InjectRepository(ProductsTbl)
    private readonly productsRepo: Repository<ProductsTbl>,
  ) {}

  async readCategories() {
    return await this.categoriesRepo.find();
  }

  async readCategoryById(categoryId: number) {
    const category = await this.categoriesRepo.findOne({
      where: { categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async readCategoryBySlug(slug: string) {
    const category = await this.categoriesRepo.findOne({
      where: { slug },
      relations: { products: true },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      const category = this.categoriesRepo.create(createCategoryDto);
      return await this.categoriesRepo.save(category);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
        if (error.message?.includes('slug')) {
          throw new BadRequestException('Slug already exists');
        }
        if (error.message?.includes('skuPrefix')) {
          throw new BadRequestException('SKU Prefix already exists');
        }
        throw new BadRequestException('Duplicate entry in categories');
      }
      throw error;
    }
  }

  async updateCategory(
    categoryId: number,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    try {
      const category = await this.categoriesRepo.findOne({
        where: { categoryId },
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
      Object.assign(category, updateCategoryDto);
      return await this.categoriesRepo.save(category);
    } catch (error: any) {
      if (error.code === 'ER_DUP_ENTRY' || error.code === '23505') {
        if (error.message?.includes('slug')) {
          throw new BadRequestException('Slug already exists');
        }
        if (error.message?.includes('skuPrefix')) {
          throw new BadRequestException('SKU Prefix already exists');
        }
        throw new BadRequestException('Duplicate entry in categories');
      }
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw error;
    }
  }

  async deleteCategory(categoryId: number) {
    const category = await this.categoriesRepo.findOne({
      where: { categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return await this.categoriesRepo.remove(category);
  }

  async assignRandomCategoriesToProducts() {
    const products = await this.productsRepo.find();
    const categories = await this.categoriesRepo.find();

    if (categories.length === 0) {
      throw new NotFoundException(
        'No categories found. Create categories first.',
      );
    }

    const updated: ProductsTbl[] = [];
    for (const product of products) {
      const randomCategory =
        categories[Math.floor(Math.random() * categories.length)];
      product.categoryId = randomCategory.categoryId;
      const saved = await this.productsRepo.save(product);
      updated.push(saved);
    }

    return {
      message: `Assigned random categories to ${updated.length} products`,
      count: updated.length,
    };
  }
}
