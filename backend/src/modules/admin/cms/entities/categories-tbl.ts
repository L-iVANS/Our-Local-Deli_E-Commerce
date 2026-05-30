import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categories_landing_tbl')
export class CategoriesTbl {
  @PrimaryGeneratedColumn()
  declare categoryId: number;

  @Column()
  declare categoryName: string;

  @Column()
  declare imageUrl: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  declare createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  declare updatedAt: Date;
}
