import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
  Index,
  BaseEntity,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Location } from '../../locations/entities/location.entity';
import { Category } from '../../categories/entities/category.entity';
import { Brand } from '../../brands/entities/brand.entity';
import { v4 as uuidv4 } from 'uuid';
import { CouponStatusAr, CouponStatusEn } from 'src/common/enums/CouponStatus';

@Entity('coupons')
export class Coupon {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4(); // Generates the UUID in the application

  @Column()
  @Index({ unique: true })
  code!: string;

  @Column({ default: 1 })
  amount!: number;

  @Column('json', { nullable: true })
  description?: { en: string; ar: string };

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

  @Column({ default: 0 })
  usedCount!: number;

  @Column({ default: 0 })
  likeCount!: number;

  @Column({ default: 0 })
  dislikeCount!: number;

  @Column({ default: false })
  isDeleted!: boolean;

  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'user_favorite_coupons',
    joinColumn: { name: 'coupon_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  userFavorite!: User[];

  @ManyToMany(() => User)
  @JoinTable({
    name: 'user_liked_coupons',
    joinColumn: { name: 'coupon_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  userLiked!: User[];

  @ManyToMany(() => User)
  @JoinTable({
    name: 'user_disliked_coupons',
    joinColumn: { name: 'coupon_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  userDisLiked!: User[];

  @ManyToOne(() => User, { nullable: false })
  createdBy!: User;

  @ManyToOne(() => User, { nullable: true })
  updatedBy?: User;

  @ManyToMany(() => Location)
  @JoinTable({
    name: 'coupon_locations',
    joinColumn: { name: 'coupon_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'location_id', referencedColumnName: 'id' },
  })
  locations!: Location[];

  @ManyToMany(() => Category)
  @JoinTable({
    name: 'coupon_categories',
    joinColumn: { name: 'coupon_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  categories!: Category[];

  @ManyToMany(() => Brand)
  @JoinTable({
    name: 'coupon_brands',
    joinColumn: { name: 'coupon_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'brand_id', referencedColumnName: 'id' },
  })
  brand!: Brand[];
}
