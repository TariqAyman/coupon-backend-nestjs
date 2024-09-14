import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, BaseEntity } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4(); // Generates the UUID in the application

  @Column({ unique: true })
  name!: string;

  @Column({ unique: true })
  locationCode!: string;

  @Column({ nullable: true })
  image?: string;

  @ManyToOne(() => User, { nullable: false })
  createdBy!: User;

  @ManyToOne(() => User, { nullable: true })
  updatedBy?: User;

  @Column({ default: false })
  isDeleted!: boolean;

  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;
}
