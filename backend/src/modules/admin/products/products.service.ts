import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductsTbl } from './entity/products.tbl';
import { CategoriesTbl } from '../categories/entity/categories.tbl';
import { CreateProductDto } from './dto/create.products';
import { UpdateProductDto } from './dto/update.products';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductsTbl)
    private readonly productsRepo: Repository<ProductsTbl>,
    @InjectRepository(CategoriesTbl)
    private readonly categoriesRepo: Repository<CategoriesTbl>,
  ) {}

  async readProducts() {
    return await this.productsRepo.find({ relations: { category: true } });
  }

  async readProductById(productId: number) {
    const product = await this.productsRepo.findOne({
      where: { productId },
      relations: { category: true },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async readProductByName(productName: string) {
    const product = await this.productsRepo.findOne({
      where: { productName },
      relations: { category: true },
    });
    if (!product) {
      throw new NotFoundException(`Product "${productName}" not found`);
    }
    return product;
  }

  async createProduct(createProductDto: CreateProductDto) {
    const category = await this.categoriesRepo.findOne({
      where: { categoryId: createProductDto.categoryId },
    });
    if (!category) {
      throw new BadRequestException(
        `Category with ID ${createProductDto.categoryId} not found`,
      );
    }
    const product = this.productsRepo.create({
      ...createProductDto,
      categoryId: category.categoryId,
      category,
    });
    return await this.productsRepo.save(product);
  }

  async updateProduct(productId: number, updateProductDto: UpdateProductDto) {
    const product = await this.productsRepo.findOne({ where: { productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    if (updateProductDto.categoryId) {
      const category = await this.categoriesRepo.findOne({
        where: { categoryId: updateProductDto.categoryId },
      });
      if (!category) {
        throw new BadRequestException(
          `Category with ID ${updateProductDto.categoryId} not found`,
        );
      }
      product.categoryId = category.categoryId;
      product.category = category;
    }
    Object.assign(product, updateProductDto);
    return await this.productsRepo.save(product);
  }

  async deleteProduct(productId: number) {
    const product = await this.productsRepo.findOne({ where: { productId } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return await this.productsRepo.remove(product);
  }
}
