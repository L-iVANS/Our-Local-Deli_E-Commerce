import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users_tbl')
export class UsersTbl {
  @PrimaryGeneratedColumn()
  declare userId: number;

  @Column()
  declare firstName: string;

  @Column()
  declare middleName: string;

  @Column()
  declare lastName: string;

  @Column({ unique: true })
  declare emailAddress: string;

  @Column()
  declare companyName: string;

  @Column()
  declare address: string;

  @Column()
  declare phoneNumber: string;

  @Column()
  declare password: string;

  @Column({ default: 'partner' })
  declare role: string;

  @Column()
  profPicture?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  declare createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  declare updatedAt: Date;

  get fullName(): string {
    return `${this.firstName} ${this.middleName} ${this.lastName}`;
  }
}
