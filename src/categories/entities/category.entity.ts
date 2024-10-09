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
import { Country } from '../../countries/entities/country.entity';
import { v4 as uuidv4 } from 'uuid';
import { IsOptional, IsString, IsUrl } from 'class-validator';
import { Brand } from '../../brands/entities/brand.entity';
import { Coupon } from '../../coupons/entities/coupon.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

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

  @ManyToMany(() => Country, (country) => country.categories)
  countries!: Country[];

  @ManyToMany(() => Brand, (brand) => brand.categories)
  @JoinTable({
    name: 'brand_categories',
    joinColumn: { name: 'categoryId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'brandId', referencedColumnName: 'id' },
  })
  brands!: Brand[];

  @ManyToMany(() => Coupon, (coupon) => coupon.categories)
  @JoinTable({
    name: 'coupon_categories',
    joinColumn: { name: 'categoryId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'couponId', referencedColumnName: 'id' },
  })
  coupons!: Coupon[];

  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  constructor(partial: Partial<Category>) {
    Object.assign(this, partial);
  }
}
