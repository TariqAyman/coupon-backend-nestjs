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
import { v4 as uuidv4 } from 'uuid';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column('json')
  title!: {
    en: string;
    ar: string;
  };

  @Column('json')
  body!: {
    en: string;
    ar: string;
  };

  @Column()
  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  userId: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  createdBy!: User;

  @Column({ default: false })
  isWatched!: boolean;

  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;
}
