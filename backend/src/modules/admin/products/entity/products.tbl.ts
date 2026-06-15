import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CategoriesTbl } from '../../categories/entity/categories.tbl';

@Entity('products_tbl')
export class ProductsTbl {
  @PrimaryGeneratedColumn()
  declare productId: number;

  @Column()
  declare productName: string;

  @Column('text')
  declare productDescription: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  declare imageUrl: string;

  @Column()
  declare sku: string;

  @Column()
  declare categoryId: number;

  @ManyToOne(() => CategoriesTbl, (category) => category.products)
  @JoinColumn({ name: 'categoryId', referencedColumnName: 'categoryId' })
  category?: CategoriesTbl;

  @Column('decimal', { precision: 10, scale: 2 })
  declare productPrice: number;

  @Column({ default: 0 })
  declare reorderPoint: number;

  @Column({ default: 0 })
  declare available: number;

  @Column({ default: 0 })
  declare inTransit: number;

  @Column({ default: 0 })
  declare blocked: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  declare createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  declare updatedAt: Date;
}
