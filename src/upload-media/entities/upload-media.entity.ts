import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('upload_media')
export class UploadMedia {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4(); // Generates the UUID in the application

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column()
  url: string;

  @Column()
  mimetype: string;

  @Column()
  size: number;

  @Column()
  entityType: string; // Name of the related entity

  @Column()
  entityId: string; // ID of the related entity

  // @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  // createdBy?: User;

  // @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  // updatedBy?: User;

  @Column({ nullable: true })
  createdAt: Date;

  @Column({ nullable: true })
  updatedAt: Date;

  @Column({ nullable: true })
  deletedAt: Date;
}
