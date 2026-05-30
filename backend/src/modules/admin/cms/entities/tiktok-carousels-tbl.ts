import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TiktokVideosTbl } from './tiktok-videos-tbl';

@Entity('cms_tiktok_carousels_tbl')
export class TiktokCarouselsTbl {
  @PrimaryGeneratedColumn()
  declare carouselId: number;

  @Column({ type: 'varchar', length: 120 })
  declare categoryName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  subtitle?: string;

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

  @OneToMany(() => TiktokVideosTbl, (video) => video.carousel)
  videos?: TiktokVideosTbl[];
}
