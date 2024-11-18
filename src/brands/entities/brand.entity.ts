import {
  Entity,
  Column,
  ManyToMany,
  ManyToOne,
  JoinTable,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';
import { IsUrl, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';
import { Country } from '../../countries/entities/country.entity';
import { v4 as uuidv4 } from 'uuid';
import { Coupon } from '../../coupons/entities/coupon.entity';
import { BilingualString } from 'src/common/dto/bilingual-string.dto';

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column('json')
  @IsNotEmpty()
  name!: BilingualString;

  @Column('json', { unique: true })
  @Index()
  slug!: BilingualString;

  @Column('json', { nullable: true })
  description?: BilingualString;

  @Column()
  @IsUrl()
  link!: string;

  @Column({ nullable: true })
  image?: string;

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

  @ManyToMany((type) => Category, (category) => category.brands)
  categories!: Category[];

  @Column({ default: 0 })
  mostUsed!: number;

  @Column({ default: 0 })
  mostFollowed!: number;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  createdBy!: User;

  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  updatedBy!: User | null;

  @ManyToMany(() => Country, (country) => country.brands)
  countries: Country[];

  @ManyToMany(() => Coupon, (coupon) => coupon.brands)
  coupons: Coupon[];

  @ManyToMany(() => User, (user) => user.followedBrands)
  userFollowed!: User[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  constructor(partial: Partial<Brand>) {
    Object.assign(this, partial);
  }

  @Column({
    nullable: true,
    select: false,
    update: false,
    default: 0,
  })
  isFollowed: number;
}
