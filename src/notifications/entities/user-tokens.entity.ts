import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('user_tokens')
export class UserToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

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
}
