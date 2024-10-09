import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { CategoriesAdminController } from './categories-admin.controller';
import { CategoriesAdminService } from './categories-admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Country } from 'src/countries/entities/country.entity';
import { UploadMediaModule } from 'src/upload-media/upload-media.module';
import { Ads } from 'src/ads/entities/ad.entity';
import { Coupon } from '../coupons/entities/coupon.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category, Country, Ads, Coupon]),
    UploadMediaModule,
  ],
  controllers: [CategoriesController, CategoriesAdminController],
  providers: [CategoriesService, CategoriesAdminService],
})
export class CategoriesModule {}
