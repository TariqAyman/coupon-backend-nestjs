import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Coupon } from '../coupons/entities/coupon.entity';
import { Category } from '../categories/entities/category.entity';
import { Brand } from '../brands/entities/brand.entity';
import { User } from '../users/entities/user.entity';
import { Ads } from '../ads/entities/ad.entity';
import { Country } from '../countries/entities/country.entity';
import { Notification } from '../notifications/entities/notification.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      Coupon,
      Category,
      Brand,
      User,
      Ads,
      Country,
      Notification,
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
