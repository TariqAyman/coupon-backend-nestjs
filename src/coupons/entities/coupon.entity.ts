import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Index,
  BaseEntity,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Country } from '../../countries/entities/country.entity';
import { Category } from '../../categories/entities/category.entity';
import { Brand } from '../../brands/entities/brand.entity';
import { v4 as uuidv4 } from 'uuid';
import { CouponStatusAr, CouponStatusEn } from 'src/common/enums/CouponStatus';
import { BilingualString } from 'src/common/dto/bilingual-string.dto';

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column('json')
  name!: BilingualString;

  @Column()
  @Index({ unique: true })
  code!: string;

  @Column({ default: 1 })
  amount!: number;

  @Column('json', { nullable: true })
  description?: BilingualString;

  @Column('json')
  status!: {
    en: CouponStatusEn;
    ar: CouponStatusAr;
  };

  @Column({ nullable: true })
  expire?: Date;

  @Column({ nullable: true })
  qrCode?: string;

  @Column({ nullable: true })
  link?: string;

  @Column('json', { nullable: true })
  seoDescription?: BilingualString;

  @Column('json', { nullable: true })
  seoKeywords?: BilingualString;

  @Column('json', { nullable: true })
  ogTitle?: BilingualString;

  @Column('json', { nullable: true })
  ogDescription?: BilingualString;

  @Column({ nullable: true })
  ogImage?: string;

  @Column({ nullable: true })
  ogUrl?: string;

  @Column({ nullable: true })
  twitterCard?: string;

  @Column('json', { nullable: true })
  twitterTitle?: BilingualString;

  @Column('json', { nullable: true })
  twitterDescription?: BilingualString;

  @Column({ nullable: true })
  twitterImage?: string;

  @Column({ default: 0 })
  usedCount!: number;

  @Column({ default: 0 })
  likeCount!: number;

  @Column({ default: 0 })
  dislikeCount!: number;

  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @ManyToMany(() => User, (user) => user.favoriteCoupons)
  userFavorite!: User[];

  @ManyToMany(() => User, (user) => user.followedCoupons)
  userFollowed!: User[];

  @ManyToMany(() => User, (user) => user.likedCoupons)
  userLiked!: User[];

  @ManyToMany(() => User, (user) => user.dislikedCoupons)
  userDisLiked!: User[];

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  createdBy!: User;

  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  updatedBy?: User;

  @ManyToMany(() => Country, (country) => country.coupons)
  countries!: Country[];

  @ManyToMany(() => Category, (category) => category.coupons)
  categories!: Category[];

  @ManyToMany(() => Brand, (brand) => brand.coupons)
  @JoinTable({
    name: 'coupon_brands',
    joinColumn: { name: 'couponId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'brandId', referencedColumnName: 'id' },
  })
  brands!: Brand[];

  constructor(partial: Partial<Coupon>) {
    Object.assign(this, partial);
  }

  @Column({
    nullable: true,
    select: false,
    update: false,
    default: 0,
  })
  isDisliked: number;

  @Column({
    nullable: true,
    select: false,
    update: false,
    default: 0,
  })
  isLiked: number;

  @Column({
    nullable: true,
    select: false,
    update: false,
    default: 0,
  })
  isFavorite: number;

  @Column({
    nullable: true,
    select: false,
    update: false,
    default: 0,
  })
  isFollowed: number;
}
