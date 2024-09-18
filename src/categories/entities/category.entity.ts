import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  BaseEntity,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Location } from '../../locations/entities/location.entity';
import { v4 as uuidv4 } from 'uuid';
import { IsOptional, IsString, IsUrl } from 'class-validator';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4(); // Generates the UUID in the application

  @Column('json')
  name!: { en: string; ar: string };

  @Column('json')
  slug!: { en: string; ar: string };

  @Column('json', { nullable: true })
  description?: { en: string; ar: string };

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  icon?: string;

  @Column({ nullable: true })
  color?: string;

  @Column('json', { nullable: true })
  seoDescription?: { en: string; ar: string };

  @Column('json', { nullable: true })
  seoKeywords?: { en: string; ar: string };

  @Column('json', { nullable: true })
  ogTitle?: { en: string; ar: string };

  @Column('json', { nullable: true })
  ogDescription?: { en: string; ar: string };

  @Column({ nullable: true })
  ogImage?: string;

  @Column({ nullable: true })
  ogUrl?: string;

  @Column({ nullable: true })
  twitterCard?: string;

  @Column('json', { nullable: true })
  twitterTitle?: { en: string; ar: string };

  @Column('json', { nullable: true })
  twitterDescription?: { en: string; ar: string };

  @Column({ nullable: true })
  twitterImage?: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  createdBy!: User;

  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  updatedBy?: User;

  @ManyToMany(() => Location)
  @JoinTable({
    name: 'category_locations',
    joinColumn: { name: 'category_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'location_id', referencedColumnName: 'id' },
  })
  locations!: Location[];

  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
