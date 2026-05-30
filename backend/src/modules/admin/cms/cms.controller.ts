import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CmsService } from './cms.service';

@Controller('admin/cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get('navbars')
  async getAllNavBars() {
    return this.cmsService.getAllNavBars();
  }

  @Post('navbars')
  async createNavBar(@Body('navBarName') navBarName: string) {
    return this.cmsService.createNavBar(navBarName);
  }

  @Patch('navbars/:navBarId')
  async updateNavBar(
    @Param('navBarId', ParseIntPipe) navBarId: number,
    @Body('navBarName') navBarName: string,
  ) {
    return this.cmsService.updateNavBar(navBarId, navBarName);
  }

  @Delete('navbars/:navBarId')
  async deleteNavBar(@Param('navBarId', ParseIntPipe) navBarId: number) {
    return this.cmsService.deleteNavBar(navBarId);
  }

  @Get('categories')
  async getAllCategories() {
    return this.cmsService.getAllCategories();
  }

  @Post('categories')
  async createCategory(
    @Body('categoryName') categoryName: string,
    @Body('imageUrl') imageUrl: string,
  ) {
    return this.cmsService.createCategory(categoryName, imageUrl);
  }

  @Patch('categories/:categoryId')
  async updateCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
    @Body('categoryName') categoryName: string,
    @Body('imageUrl') imageUrl: string,
  ) {
    return this.cmsService.updateCategory(categoryId, categoryName, imageUrl);
  }

  @Delete('categories/:categoryId')
  async deleteCategory(
    @Param('categoryId', ParseIntPipe) categoryId: number,
  ) {
    return this.cmsService.deleteCategory(categoryId);
  }

  @Get('carousels')
  async getAllCarousels() {
    return this.cmsService.getAllCarousels();
  }

  @Post('carousels')
  async createCarousel(
    @Body('categoryName') categoryName: string,
    @Body('subtitle') subtitle?: string,
    @Body('sortOrder') sortOrder?: number,
  ) {
    return this.cmsService.createCarousel(categoryName, subtitle, sortOrder ?? 0);
  }

  @Patch('carousels/:carouselId')
  async updateCarousel(
    @Param('carouselId', ParseIntPipe) carouselId: number,
    @Body('categoryName') categoryName: string,
    @Body('subtitle') subtitle?: string,
    @Body('sortOrder') sortOrder?: number,
  ) {
    return this.cmsService.updateCarousel(
      carouselId,
      categoryName,
      subtitle,
      sortOrder ?? 0,
    );
  }

  @Delete('carousels/:carouselId')
  async deleteCarousel(@Param('carouselId', ParseIntPipe) carouselId: number) {
    return this.cmsService.deleteCarousel(carouselId);
  }
}
