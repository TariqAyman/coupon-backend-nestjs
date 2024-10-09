import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  DeleteDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { Ads } from '../../ads/entities/ad.entity';
import { Category } from '../../categories/entities/category.entity';
import { Brand } from '../../brands/entities/brand.entity';
import { Coupon } from '../../coupons/entities/coupon.entity';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column({ nullable: true })
  countryCode!: string;

  @Column({ nullable: true })
  image?: string;

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

  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @ManyToMany((type) => Ads, (ads) => ads.countries)
  @JoinTable({
    name: 'ads_countries',
    joinColumn: { name: 'countryId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'adsId', referencedColumnName: 'id' },
  })
  ads!: Ads[];

  @ManyToMany((type) => Category, (category) => category.countries)
  @JoinTable({
    name: 'category_countries',
    joinColumn: { name: 'countryId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'categoryId', referencedColumnName: 'id' },
  })
  categories!: Category[];

  @ManyToMany((type) => Brand, (brand) => brand.countries)
  @JoinTable({
    name: 'brand_countries',
    joinColumn: { name: 'countryId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'brandId', referencedColumnName: 'id' },
  })
  brands: Brand[];

  @ManyToMany((type) => Coupon, (coupon) => coupon.countries)
  @JoinTable({
    name: 'coupon_countries',
    joinColumn: { name: 'countryId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'couponId', referencedColumnName: 'id' },
  })
  coupons!: Coupon[];

  constructor(partial: Partial<Country>) {
    Object.assign(this, partial);
  }
}
