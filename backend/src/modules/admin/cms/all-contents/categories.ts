import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesTbl } from '../entities/categories-tbl';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoriesTbl)
    private readonly categoriesRepository: Repository<CategoriesTbl>,
  ) {}

  async getAllCategories() {
    return this.categoriesRepository.find();
  }

  async createCategory(categoryName: string, imageUrl: string) {
    const newCategory = this.categoriesRepository.create({
      categoryName,
      imageUrl,
    });
    return this.categoriesRepository.save(newCategory);
  }

  async updateCategory(categoryId: number, categoryName: string, imageUrl: string) {
    const category = await this.categoriesRepository.findOne({
      where: { categoryId },
    });
    if (!category) {
      throw new Error('Category not found');
    }

    category.categoryName = categoryName;
    category.imageUrl = imageUrl;
    return this.categoriesRepository.save(category);
  }

  async deleteCategory(categoryId: number) {
    const category = await this.categoriesRepository.findOne({
      where: { categoryId },
    });
    if (!category) {
      throw new Error('Category not found');
    }

    return this.categoriesRepository.remove(category);
  }
}
