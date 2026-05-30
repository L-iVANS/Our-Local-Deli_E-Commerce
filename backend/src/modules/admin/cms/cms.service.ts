import { Injectable } from '@nestjs/common';
import { NavBarService } from './all-contents/nav-bar';
import { CategoriesService } from './all-contents/categories';
import { TiktokCarouselService } from './all-contents/tiktok-carousel';

@Injectable()
export class CmsService {
  constructor(
    private readonly navBarService: NavBarService,
    private readonly categoriesService: CategoriesService,
    private readonly tiktokCarouselService: TiktokCarouselService,
  ) {}

  async getAllNavBars() {
    return this.navBarService.getAllNavbars();
  }

  async createNavBar(navBarName: string) {
    return this.navBarService.createNavBar(navBarName);
  }

  async updateNavBar(navBarId: number, navBarName: string) {
    return this.navBarService.updateNavBar(navBarId, navBarName);
  }

  async deleteNavBar(navBarId: number) {
    return this.navBarService.deleteNavBar(navBarId);
  }

  async getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  async createCategory(categoryName: string, imageUrl: string) {
    return this.categoriesService.createCategory(categoryName, imageUrl);
  }

  async updateCategory(categoryId: number, categoryName: string, imageUrl: string) {
    return this.categoriesService.updateCategory(
      categoryId,
      categoryName,
      imageUrl,
    );
  }

  async deleteCategory(categoryId: number) {
    return this.categoriesService.deleteCategory(categoryId);
  }

  async getAllCarousels() {
    return this.tiktokCarouselService.getAllCarousels();
  }

  async createCarousel(categoryName: string, subtitle?: string, sortOrder = 0) {
    return this.tiktokCarouselService.createCarousel(
      categoryName,
      subtitle,
      sortOrder,
    );
  }

  async updateCarousel(
    carouselId: number,
    categoryName: string,
    subtitle?: string,
    sortOrder = 0,
  ) {
    return this.tiktokCarouselService.updateCarousel(
      carouselId,
      categoryName,
      subtitle,
      sortOrder,
    );
  }

  async deleteCarousel(carouselId: number) {
    return this.tiktokCarouselService.deleteCarousel(carouselId);
  }
}
