import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('contacts_tbl')
export class ContactsTbl {
  @PrimaryGeneratedColumn()
  declare contactId: number;

  @Column()
  declare name: string;

  @Column()
  declare email: string;

  @Column()
  declare message: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  declare createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  declare updatedAt: Date;
}
