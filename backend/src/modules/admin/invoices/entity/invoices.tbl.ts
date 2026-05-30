import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrdersTbl } from '../../orders/entity/orders.tbl';
import { UsersTbl } from '../../../general/auth/entity/users.tbl';

@Entity('invoices_tbl')
export class InvoicesTbl {
  @PrimaryGeneratedColumn()
  declare invoiceId: number;

  @Column({ unique: true })
  declare orderId: number;

  @Column()
  declare userId: number;

  @ManyToOne(() => OrdersTbl)
  @JoinColumn({ name: 'orderId' })
  declare order: OrdersTbl;

  @ManyToOne(() => UsersTbl)
  @JoinColumn({ name: 'userId' })
  declare user: UsersTbl;

  @Column({ unique: true })
  declare invoiceNumber: string;

  @Column('decimal', { precision: 10, scale: 2 })
  declare totalAmount: number;

  @Column({ type: 'timestamp' })
  declare dueDate: Date;

  @Column()
  declare paymentStatus: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  declare createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  declare updatedAt: Date;
}
