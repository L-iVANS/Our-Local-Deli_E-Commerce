import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { ProductsTbl } from '../../products/entity/products.tbl';

@Entity('categories_tbl')
@Unique(['slug'])
@Unique(['skuPrefix'])
export class CategoriesTbl {
  @PrimaryGeneratedColumn()
  declare categoryId: number;

  @Column()
  declare categoryName: string;

  @Column()
  declare slug: string;

  @Column()
  declare skuPrefix: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  declare createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  declare updatedAt: Date;

  @OneToMany(() => ProductsTbl, (product) => product.category)
  products?: ProductsTbl[];
}
