import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NavBarTbl } from './nav-bar-tbl';

@Entity('nav_links_tbl')
export class NavLinksTbl {
  @PrimaryGeneratedColumn()
  declare navLinkId: number;

  @Column()
  declare navBarId: number;

  @ManyToOne(() => NavBarTbl, (navBar) => navBar.navLinks)
  @JoinColumn({ name: 'navBarId' })
  navBar?: NavBarTbl;

  @Column()
  declare navLinkName: string;

  @Column()
  declare navLinkUrl: string;

  @Column()
  declare isActive: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  declare createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  declare updatedAt: Date;
}
