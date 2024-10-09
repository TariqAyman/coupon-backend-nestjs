import { Module } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { CountriesController } from './countries.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountriesAdminService } from './countries-admin.service';
import { CountriesAdminController } from './countries-admin.controller';
import { Country } from './entities/country.entity';
import { UploadMediaModule } from 'src/upload-media/upload-media.module';
import { Ads } from '../ads/entities/ad.entity';
import { Category } from '../categories/entities/category.entity';
import { Brand } from '../brands/entities/brand.entity';
import { Coupon } from '../coupons/entities/coupon.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Country, Ads, Category, Brand, Coupon, Category]),
    UploadMediaModule,
  ],
  controllers: [CountriesController, CountriesAdminController],
  providers: [CountriesService, CountriesAdminService],
})
export class CountriesModule {}
