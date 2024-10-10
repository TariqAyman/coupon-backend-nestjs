import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Coupon } from '../../coupons/entities/coupon.entity';
import { Brand } from '../../brands/entities/brand.entity';
import { UserRole } from '../../common/enums/UserRole';
import { UserStatus } from '../../common/enums/UserStatus';
import { UserGender } from '../../common/enums/UserGender';
import { UserProvider } from '../../common/enums/UserProvider';
import { Exclude } from 'class-transformer';
import { v4 as uuidv4 } from 'uuid';
import { UserToken } from 'src/notifications/entities/user-tokens.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column()
  fullName!: string;

  @Column({ unique: true })
  email!: string;

  @Exclude()
  @Column()
  password!: string;

  @Column({ nullable: true })
  changePasswordTime!: Date;

  @Column()
  phoneNumber: string;

  @Column()
  phoneNumberCountryCode: string;

  @Column()
  userLocale: string;

  @Column()
  countryCode: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.User,
  })
  role!: string;

  @Column({ default: false })
  confirmAccount!: boolean;

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.Offline,
  })
  status!: string;

  @Column({ nullable: true })
  avatar?: string;

  @Column({ nullable: true })
  birthday!: Date;

  @Column({ nullable: true })
  joined!: Date;

  @Column({
    type: 'enum',
    enum: UserGender,
    nullable: true,
  })
  gender!: string;

  @Column({
    type: 'enum',
    enum: UserProvider,
    default: UserProvider.System,
  })
  provider!: string;

  @Column({ nullable: true })
  verificationCode!: string;

  @Column({ nullable: true })
  verificationCodeExpiresAt!: Date;

  @Column({ nullable: true })
  createdAt!: Date;

  @Column({ nullable: true })
  updatedAt!: Date;

  @Column({ nullable: true })
  deletedAt!: Date;

  @Column({ nullable: true })
  lastLogin!: Date;

  @Column({ nullable: true })
  lastLogout!: Date;

  @ManyToMany(() => Coupon, (coupon) => coupon.userLiked)
  @JoinTable({
    name: 'user_liked_coupons',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'couponId', referencedColumnName: 'id' },
  })
  likedCoupons: Coupon[];

  @ManyToMany(() => Coupon, (coupon) => coupon.userFollowed)
  @JoinTable({
    name: 'user_followed_coupons',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'couponId', referencedColumnName: 'id' },
  })
  followedCoupons: Coupon[];

  @ManyToMany(() => Coupon, (coupon) => coupon.userFavorite)
  @JoinTable({
    name: 'user_favorite_coupons',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'couponId', referencedColumnName: 'id' },
  })
  favoriteCoupons: Coupon[];

  @ManyToMany(() => Coupon, (coupon) => coupon.userDisLiked)
  @JoinTable({
    name: 'user_disliked_coupons',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'couponId', referencedColumnName: 'id' },
  })
  dislikedCoupons: Coupon[];

  @ManyToMany(() => Brand, (brand) => brand.userFollowed)
  @JoinTable({
    name: 'user_followed_brands',
    joinColumn: { name: 'userId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'brandId', referencedColumnName: 'id' },
  })
  followedBrands: Brand[];

  @OneToMany(() => UserToken, (userToken) => userToken.user)
  userTokens: UserToken[];
}
