import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('social_links_tbl')
export class SocialLinksTbl {
  @PrimaryGeneratedColumn()
  declare socialLinkId: number;

  @Column()
  declare platform: string;

  @Column()
  declare url: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  declare createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  declare updatedAt: Date;
}
