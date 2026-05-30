import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('faqs_tbl')
export class FaqsTbl {
  @PrimaryGeneratedColumn()
  declare faqId: number;

  @Column()
  declare question: string;

  @Column()
  declare answer: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  declare createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  declare updatedAt: Date;
}
