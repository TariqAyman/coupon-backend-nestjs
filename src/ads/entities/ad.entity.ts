import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  CreateDateColumn,
  UpdateDateColumn,
  EventSubscriber,
  EntitySubscriberInterface,
  JoinColumn,
  BaseEntity,
  LoadEvent,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Location } from '../../locations/entities/location.entity';
import { v4 as uuidv4 } from 'uuid';

@Entity('ads')
export class Ads {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4(); // Generates the UUID in the application

  @Column({ unique: true })
  name!: string;

  @Column()
  link!: string;

  @Column({ nullable: true })
  image!: string;

  @ManyToOne(() => User, { nullable: false })
  @JoinColumn({ name: 'createdById' })
  createdBy!: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'updatedById' })
  updatedBy!: User;

  @ManyToMany(() => Location)
  @JoinTable({
    name: 'ads_locations',
    joinColumn: { name: 'ads_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'location_id', referencedColumnName: 'id' },
  })
  locations!: Location[];

  @Column({ default: false })
  isDeleted!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}

@EventSubscriber()
export class AdsSubscriber implements EntitySubscriberInterface<Ads> {
  listenTo() {
    return Ads;
  }

  async beforeLoad(event: LoadEvent<Ads>) {
    if (event.entity) {
      // Manually load relations
      await event.manager.getRepository(Ads).findOne({
        where: { id: event.entity.id },
        relations: ['createdBy', 'updatedBy', 'locations'],
      });
    }
  }
}
