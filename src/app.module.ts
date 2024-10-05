import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { UsersModule } from './users/users.module';
import { AdsModule } from './ads/ads.module';
import { BrandsModule } from './brands/brands.module';
import { CategoriesModule } from './categories/categories.module';
import { CouponsModule } from './coupons/coupons.module';
import { CountriesModule } from './countries/countries.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { DatabaseModule } from './database/database.module';
import { CommonModule } from './common/common.module';
import { UploadMediaModule } from './upload-media/upload-media.module';

@Module({
  imports: [
    DatabaseModule,
    CommonModule,
    AuthenticationModule,
    AdsModule,
    UsersModule,
    BrandsModule,
    CategoriesModule,
    CouponsModule,
    CountriesModule,
    NotificationsModule,
    UploadMediaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
