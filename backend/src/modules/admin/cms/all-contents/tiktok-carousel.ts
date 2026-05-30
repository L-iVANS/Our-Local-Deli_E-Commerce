import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TiktokCarouselsTbl } from '../entities/tiktok-carousels-tbl';
import { TiktokVideosTbl } from '../entities/tiktok-videos-tbl';

@Injectable()
export class TiktokCarouselService {
  constructor(
    @InjectRepository(TiktokCarouselsTbl)
    private readonly carouselRepository: Repository<TiktokCarouselsTbl>,
    @InjectRepository(TiktokVideosTbl)
    private readonly videosRepository: Repository<TiktokVideosTbl>,
  ) {}

  async getAllCarousels() {
    return this.carouselRepository.find({ relations: { videos: true } });
  }

  async createCarousel(categoryName: string, subtitle?: string, sortOrder = 0) {
    const newCarousel = this.carouselRepository.create({
      categoryName,
      subtitle,
      sortOrder,
    });
    return this.carouselRepository.save(newCarousel);
  }

  async updateCarousel(
    carouselId: number,
    categoryName: string,
    subtitle?: string,
    sortOrder = 0,
  ) {
    const carousel = await this.carouselRepository.findOne({
      where: { carouselId },
    });
    if (!carousel) {
      throw new Error('Carousel not found');
    }
    carousel.categoryName = categoryName;
    carousel.subtitle = subtitle;
    carousel.sortOrder = sortOrder;
    return this.carouselRepository.save(carousel);
  }

  async deleteCarousel(carouselId: number) {
    const carousel = await this.carouselRepository.findOne({
      where: { carouselId },
    });
    if (!carousel) {
      throw new Error('Carousel not found');
    }

    return this.carouselRepository.remove(carousel);
  }

  async addVideoToCarousel(
    carouselId: number,
    tiktokUrl: string,
    caption?: string,
    buyNowUrl?: string,
    sortOrder = 0,
  ) {
    const carousel = await this.carouselRepository.findOne({
      where: { carouselId },
    });
    if (!carousel) {
      throw new Error('Carousel not found');
    }
    const newVideo = this.videosRepository.create({
      carouselId,
      tiktokUrl,
      caption,
      buyNowUrl,
      sortOrder,
    });
    return this.videosRepository.save(newVideo);
  }

  async removeVideo(videoId: number) {
    const video = await this.videosRepository.findOne({ where: { videoId } });
    if (!video) {
      throw new Error('Video not found');
    }
    return this.videosRepository.remove(video);
  }
}
