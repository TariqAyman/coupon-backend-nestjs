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
  LoadEvent,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Country } from '../../countries/entities/country.entity';
import { v4 as uuidv4 } from 'uuid';
import { IsOptional, IsString, IsUrl } from 'class-validator';

@Entity('ads')
export class Ads {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();

  @Column()
  name!: string;

  @Column()
  link!: string;

  @Column({ nullable: true })
  image?: string;

  @Column('json', { nullable: true })
  seoDescription?: { en: string; ar: string };

  @Column('json', { nullable: true })
  seoKeywords?: { en: string; ar: string };

  @Column('json', { nullable: true })
  ogTitle?: { en: string; ar: string };

  @Column('json', { nullable: true })
  ogDescription?: { en: string; ar: string };

  @Column({ nullable: true })
  ogImage?: string;

  @Column({ nullable: true })
  ogUrl?: string;

  @Column({ nullable: true })
  twitterCard?: string;

  @Column('json', { nullable: true })
  twitterTitle?: { en: string; ar: string };

  @Column('json', { nullable: true })
  twitterDescription?: { en: string; ar: string };

  @Column({ nullable: true })
  twitterImage?: string;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'createdById' })
  createdBy!: User;

  @ManyToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'updatedById' })
  updatedBy!: User;

  @ManyToMany((type) => Country, (country) => country.ads)
  countries!: Country[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn({ nullable: true })
  deletedAt?: Date;

  constructor(partial: Partial<Ads>) {
    Object.assign(this, partial);
  }
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
        relations: ['createdBy', 'updatedBy', 'countries'],
      });
    }
  }
}
