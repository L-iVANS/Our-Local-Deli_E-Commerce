import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NavLinksTbl } from './nav-links-tbl';

@Entity('nav_bar_tbl')
export class NavBarTbl {
  @PrimaryGeneratedColumn()
  declare navBarId: number;

  @Column()
  declare navBarName: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  declare createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  declare updatedAt: Date;

  @OneToMany(() => NavLinksTbl, (navLink) => navLink.navBar)
  navLinks?: NavLinksTbl[];
}
