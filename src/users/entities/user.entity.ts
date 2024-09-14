import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
  BaseEntity,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid'; // Add this import
import { Coupon } from '../../coupons/entities/coupon.entity';
import { Brand } from '../../brands/entities/brand.entity';
import { UserRole } from '../../common/enums/UserRole';
import { UserStatus } from '../../common/enums/UserStatus';
import { UserGender } from '../../common/enums/UserGender';
import { UserProvider } from '../../common/enums/UserProvider';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4(); // Generates the UUID in the application

  @Column()
  fullName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ nullable: true })
  changePasswordTime!: Date;

  @Column({ nullable: true })
  phoneNumber!: string;

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
  image!: string;

  @Column({ nullable: true })
  DOB!: Date;

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

  @Column({ default: false })
  isDeleted!: boolean;

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

  @ManyToMany(() => Coupon)
  @JoinTable({
    name: 'user_liked_coupons',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'coupon_id', referencedColumnName: 'id' },
  })
  likedCoupons: Coupon[];

  @ManyToMany(() => Coupon)
  @JoinTable({
    name: 'user_followed_coupons',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'coupon_id', referencedColumnName: 'id' },
  })
  followedCoupons: Coupon[];

  @ManyToMany(() => Coupon)
  @JoinTable({
    name: 'user_favorite_coupons',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'coupon_id', referencedColumnName: 'id' },
  })
  favoriteCoupons: Coupon[];

  @ManyToMany(() => Coupon)
  @JoinTable({
    name: 'user_disliked_coupons',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'coupon_id', referencedColumnName: 'id' },
  })
  dislikedCoupons: Coupon[];

  @ManyToMany(() => Brand)
  @JoinTable({
    name: 'user_followed_brands',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'brand_id', referencedColumnName: 'id' },
  })
  followedBrands: Brand[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}
