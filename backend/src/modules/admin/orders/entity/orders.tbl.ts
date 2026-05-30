import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProductsTbl } from '../../products/entity/products.tbl';
import { UsersTbl } from '../../../general/auth/entity/users.tbl';
import { OrderStatus } from './order-status.enum';

@Entity('orders_tbl')
export class OrdersTbl {
  @PrimaryGeneratedColumn()
  declare orderId: number;

  @Column({ nullable: true })
  orderNumber?: string;

  @Column()
  declare productId: number;

  @Column()
  declare userId: number;

  @Column({ nullable: true })
  orderType?: string;

  @Column()
  declare quantity: number;

  @Column()
  declare unitPrice: number;

  @Column()
  declare totalPrice: number;

  @Column({ nullable: true })
  deliveryFee?: number;

  @Column({ nullable: true })
  grandTotal?: number;

  @Column({
    type: 'enum',
    enum: OrderStatus,
    default: OrderStatus.PENDING_APPROVAL,
  })
  declare status: string;

  @Column({ nullable: true })
  deliveryStatus?: string;

  @Column({ nullable: true, default: false })
  usePrimaryAddress?: boolean;

  @Column({ type: 'text', nullable: true })
  deliveryAddress?: string;

  @Column({ nullable: true })
  contactPerson?: string;

  @Column({ nullable: true })
  contactNumber?: string;

  @Column({ type: 'timestamp', nullable: true })
  deliveryDate?: Date;

  @Column({ type: 'text', nullable: true })
  deliveryNotes?: string;

  @Column({ nullable: true })
  paymentMethod?: string;

  @Column({ type: 'text', nullable: true })
  paymentProofImage?: string;

  @Column({ type: 'timestamp', nullable: true })
  paymentProofUploadedAt?: Date;

  @Column({ type: 'varchar', length: 500, nullable: true })
  paymentProofRejectionReason?: string;

  @Column({ type: 'int', default: 0 })
  paymentProofAttempts: number = 0;

  @Column({
    type: 'enum',
    enum: ['pending', 'rejected', 'approved'],
    nullable: true,
  })
  paymentProofStatus?: 'pending' | 'rejected' | 'approved';

  @Column({ type: 'varchar', length: 200, nullable: true })
  paymentIntentId?: string;

  @Column({ type: 'varchar', length: 50, nullable: true, default: 'UNPAID' })
  paymentStatus?: string;

  @Column({ nullable: true })
  paymongoTransactionId?: string;

  @Column({ nullable: true })
  paymongoAmount?: number;

  @Column({ nullable: true })
  paymongoPaymentMethod?: string;

  @Column({ type: 'timestamp', nullable: true })
  paymongoTimestamp?: Date;

  @Column({ type: 'varchar', length: 200, nullable: true })
  rejectionReason?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  declare createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  declare updatedAt: Date;

  @ManyToOne(() => ProductsTbl)
  @JoinColumn({ name: 'productId' })
  product?: ProductsTbl;

  @ManyToOne(() => UsersTbl)
  @JoinColumn({ name: 'userId' })
  user?: UsersTbl;
}
