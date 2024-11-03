import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Coupon } from '../coupons/entities/coupon.entity';
import { Category } from '../categories/entities/category.entity';
import { Brand } from '../brands/entities/brand.entity';
import { User } from '../users/entities/user.entity';
import { Ads } from '../ads/entities/ad.entity';
import { Country } from '../countries/entities/country.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { UserRole } from 'src/common/enums/UserRole';
import * as moment from 'moment';
import { UserStatus } from 'src/common/enums/UserStatus';
import { log } from 'console';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Coupon) private couponRepository: Repository<Coupon>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Brand) private brandRepository: Repository<Brand>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Ads) private adsRepository: Repository<Ads>,
    @InjectRepository(Country) private countryRepository: Repository<Country>,
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async getCounts() {
    const coupon = await this.couponRepository.count();
    const categories = await this.categoryRepository.count();
    const brands = await this.brandRepository.count();
    const users = await this.userRepository.count();
    const ads = await this.adsRepository.count();
    const locations = await this.countryRepository.count();
    const notifications = await this.notificationRepository.count();

    return {
      users,
      coupon,
      categories,
      brands,
      ads,
      locations,
      notifications,
    };
  }

  async getLineChartDataPerMonth() {
    const userRegistrations = await this.countsPerMonth(
      this.userRepository.createQueryBuilder('entity'),
      {
        role: UserRole.User.toString(),
        status: [UserStatus.Online],
      },
    );

    const couponCreations = await this.countsPerMonth(
      this.couponRepository.createQueryBuilder('entity'),
      {},
    );

    const subQuery = this.couponRepository
      .createQueryBuilder('entity')
      .leftJoin('entity.userLiked', 'userLiked')
      .select('entity.id', 'couponId')
      .addSelect('COUNT(userLiked.id)', 'likeCount')
      .groupBy('entity.id');

    const userCouponInteractions = await this.countsPerMonth(
      this.couponRepository
        .createQueryBuilder('entity')
        .leftJoinAndSelect('entity.userLiked', 'userLiked')
        .addSelect('userLiked.createdAt')
        .leftJoinAndSelect(
          `(${subQuery.getQuery()})`,
          'likes',
          'likes.couponId = entity.id',
        ),
      {},
    );

    return {
      coupons: couponCreations,
      users: userRegistrations,
      // userCouponInteractions: userCouponInteractions,
    };
  }

  async getLineChartDataPerDaily() {
    const userRegistrations = await this.countsPerDay(
      this.userRepository.createQueryBuilder('entity'),
      {
        role: UserRole.User.toString(),
        status: [UserStatus.Online],
      },
    );

    const couponCreations = await this.countsPerDay(
      this.couponRepository.createQueryBuilder('entity'),
      {},
    );

    // const subQuery = this.couponRepository
    //   .createQueryBuilder('entity')
    //   .leftJoin('entity.userLiked', 'userLiked')
    //   .select('entity.id', 'couponId')
    //   .addSelect('COUNT(userLiked.id)', 'likeCount')
    //   .groupBy('entity.id');

    // const userCouponInteractions = await this.countsPerDay(
    //   this.couponRepository
    //     .createQueryBuilder('entity')
    //     .leftJoinAndSelect('entity.userLiked', 'userLiked')
    //     .addSelect('userLiked.createdAt')
    //     .leftJoinAndSelect(
    //       `(${subQuery.getQuery()})`,
    //       'likes',
    //       'likes.couponId = entity.id',
    //     ),
    //   {},
    // );

    return {
      coupons: couponCreations,
      users: userRegistrations,
      // userCouponInteractions: userCouponInteractions,
    };
  }

  async countsPerMonth(
    customEntityRepository: any,
    filters: any,
    groupBy?: string | null,
  ): Promise<Record<string, number>> {
    const from = filters.start_date
      ? moment(filters.start_date)
      : moment().subtract(1, 'year').startOf('month');

    const to = filters.end_date
      ? moment(filters.end_date)
      : moment().endOf('month');

    const query = customEntityRepository
      .where('entity.createdAt BETWEEN :from AND :to', {
        from: from.toDate(),
        to: to.toDate(),
      })
      .orderBy('entity.createdAt');

    if (filters.role) {
      query.andWhere('entity.role = :role', {
        role: filters.role,
      });
    }

    if (filters.status && Array.isArray(filters.status)) {
      query.andWhere('entity.status IN (:...status)', {
        status: filters.status,
      });
    }

    if (filters.groupBy) {
      query.addGroupBy(filters.groupBy);
    }

    const result = await query.getMany();

    const grouped = result.reduce((acc: any, item: any) => {
      const key = moment(item.createdAt).format('YYYY_M');
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const counts: Record<string, number> = {};
    let current = from.clone();

    console.log('filters', filters);
    console.log('grouped', grouped);
    console.log(current.isBefore(to));

    while (current.isBefore(to)) {
      const key = current.format('YYYY_M');
      counts[this.parseMonthsDate(key)] = grouped[key] || 0;
      current.add(1, 'month');
    }

    return counts;
  }

  async countsPerDay(
    customEntityRepository: any,
    filters: any,
  ): Promise<Record<string, number>> {
    const from = filters.start_date
      ? moment(filters.start_date)
      : moment().subtract(1, 'month').startOf('month');

    const to = filters.end_date
      ? moment(filters.end_date).add(1, 'day')
      : moment().endOf('month');

    const query = customEntityRepository
      .where('entity.createdAt BETWEEN :from AND :to', {
        from: from.toDate(),
        to: to.toDate(),
      })
      .orderBy('entity.createdAt');

    if (filters.status && Array.isArray(filters.status)) {
      query.andWhere('entity.status IN (:...status)', {
        status: filters.status,
      });
    }

    const result = await query.getMany();
    const grouped = result.reduce((acc: any, item: any) => {
      const key = moment(item.createdAt).format('YYYY/MM/DD');
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const counts: Record<string, number> = {};
    let current = from.clone();

    while (current.isBefore(to)) {
      const key = current.format('YYYY/MM/DD');
      counts[key] = grouped[key] || 0;
      current.add(1, 'day');
    }

    return counts;
  }

  private parseMonthsDate(yearMonth: string): string {
    const [year, month] = yearMonth.split('_');
    const monthName = moment()
      .month(parseInt(month, 10) - 1)
      .format('MMMM');
    return `${monthName} ${year}`;
  }
}
