import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('site_settings_tbl')
export class SiteSettingsTbl {
  @PrimaryGeneratedColumn()
  declare settingId: number;

  @Column()
  declare siteName: string;

  @Column()
  declare siteDescription: string;

  @Column()
  declare brandTagline: string;

  @Column()
  declare contactEmail: string;

  @Column()
  declare contactPhone: string;

  @Column()
  declare address: string;

  @Column()
  declare weekdaysHrs: string;

  @Column()
  declare weekendHrs: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  declare createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  declare updatedAt: Date;
}
