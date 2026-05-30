import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TiktokCarouselsTbl } from './tiktok-carousels-tbl';

@Entity('cms_tiktok_videos_tbl')
export class TiktokVideosTbl {
  @PrimaryGeneratedColumn()
  declare videoId: number;

  @Column({ type: 'int' })
  declare carouselId: number;

  @ManyToOne(() => TiktokCarouselsTbl, (carousel) => carousel.videos)
  @JoinColumn({ name: 'carouselId' })
  carousel?: TiktokCarouselsTbl;

  @Column({ type: 'varchar', length: 500 })
  declare tiktokUrl: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  caption?: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  buyNowUrl?: string;

  @Column({ type: 'int', default: 0 })
  declare sortOrder: number;

  @Column({ type: 'boolean', default: true })
  declare isActive: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  declare createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  declare updatedAt: Date;
}
