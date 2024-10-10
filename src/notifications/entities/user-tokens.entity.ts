import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('user_tokens')
export class UserToken {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column()
  userId: string;

  @Column()
  token: string;

  @Column()
  os: string;

  @Column()
  osVersion: string;

  @Column()
  model: string;

  @Column()
  country: string;

  @Column()
  location: string;

  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  @Column({ type: 'json', nullable: true })
  topics: string[];

  @ManyToOne(() => User, (user) => user.userTokens)
  user: User;
}
