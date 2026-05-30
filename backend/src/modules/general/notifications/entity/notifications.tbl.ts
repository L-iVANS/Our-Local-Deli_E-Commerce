import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UsersTbl } from '../../auth/entity/users.tbl';

@Entity('notifications_tbl')
export class NotificationsTbl {
  @PrimaryGeneratedColumn()
  declare notificationId: number;

  @Column()
  declare userId: number;

  @ManyToOne(() => UsersTbl, { eager: false })
  @JoinColumn({ name: 'userId' })
  user?: UsersTbl;

  @Column({ type: 'varchar', length: 50 })
  declare type:
    | 'payment_proof_rejected'
    | 'payment_proof_approved'
    | 'order_status_change'
    | 'new_order'
    | 'general';

  @Column({ type: 'varchar', length: 255 })
  declare title: string;

  @Column({ type: 'text' })
  declare message: string;

  @Column({ nullable: true, type: 'int' })
  orderId?: number;

  @Column({ nullable: true, type: 'text' })
  metadata?: string;

  @Column({ default: false })
  isRead: boolean = false;

  @CreateDateColumn()
  declare createdAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  readAt?: Date;
}
