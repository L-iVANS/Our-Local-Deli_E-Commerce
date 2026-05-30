import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('hero_section_tbl')
export class HeroSectionTbl {
  @PrimaryGeneratedColumn()
  declare heroSectionId: number;

  @Column()
  declare title: string;

  @Column()
  declare headlineOne: string;

  @Column()
  declare headlineTwo: string;

  @Column()
  declare description: string;

  @Column()
  declare buttonText: string;

  @Column()
  declare buttonLink: string;

  @Column()
  declare imageUrl: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  declare createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  declare updatedAt: Date;
}
