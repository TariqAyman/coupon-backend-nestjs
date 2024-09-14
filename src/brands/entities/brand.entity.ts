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
} from 'typeorm';
import { IsUrl, IsNotEmpty } from 'class-validator';
import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';
import { Location } from '../../locations/entities/location.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity('brands')
export class Brand {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4(); // Generates the UUID in the application

  @Column('json')
  @IsNotEmpty()
  name!: { en: string; ar: string };

  @Column({ unique: true })
  @Index()
  slug!: string;

  @Column('json', { nullable: true })
  description?: { en: string; ar: string };

  @Column()
  @IsUrl()
  link!: string;

  @Column({ nullable: true })
  image?: string;

  @ManyToMany(() => Category, { cascade: true })
  @JoinTable({
    name: 'brand_categories',
    joinColumn: { name: 'brand_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'id' },
  })
  category!: Category[];

  @Column({ default: 0 })
  mostUsed!: number;

  @Column({ default: 0 })
  mostFollowed!: number;

  @ManyToOne(() => User, { nullable: false })
  createdBy!: User;

  @ManyToOne(() => User, { nullable: true })
  updatedBy!: User | null;

  @ManyToMany(() => Location, { cascade: true })
  @JoinTable({
    name: 'brand_locations',
    joinColumn: { name: 'brand_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'location_id', referencedColumnName: 'id' },
  })
  location!: Location[];

  @ManyToMany(() => User, { cascade: true })
  @JoinTable({
    name: 'user_followed_brands',
    joinColumn: { name: 'brand_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  userFollowed!: User[];

  @Column({ default: false })
  isDeleted!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
