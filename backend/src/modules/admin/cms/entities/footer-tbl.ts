import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('footer_tbl')
export class FooterTbl {
  @PrimaryGeneratedColumn()
  declare footerId: number;

  @Column()
  declare description: string;

  @Column()
  declare copyright: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  declare createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  declare updatedAt: Date;
}
