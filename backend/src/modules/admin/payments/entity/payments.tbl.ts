import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InvoicesTbl } from '../../invoices/entity/invoices.tbl';

@Entity('payments_tbl')
export class PaymentsTbl {
  @PrimaryGeneratedColumn()
  declare paymentId: number;

  @Column()
  declare invoiceId: number;

  @ManyToOne(() => InvoicesTbl)
  @JoinColumn({ name: 'invoiceId' })
  declare invoice: InvoicesTbl;

  @Column()
  declare paymentAmount: number;

  @Column()
  declare paymentReference: string;

  @Column()
  declare paymentDate: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  declare createdAt: Date;
}
