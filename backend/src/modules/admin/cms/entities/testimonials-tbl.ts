import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('testimonials_tbl')
export class TestimonialsTbl {
  @PrimaryGeneratedColumn()
  declare testimonialId: number;

  @Column()
  declare customerName: string;

  @Column()
  declare message: string;

  @Column()
  declare rating: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  declare createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  declare updatedAt: Date;
}
