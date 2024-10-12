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
import { BilingualString } from 'src/common/dto/bilingual-string.dto';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column('json')
  name!: BilingualString;

  @Column('json')
  slug!: BilingualString;

  @Column('json', { nullable: true })
  description?: BilingualString;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  color?: string;

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
