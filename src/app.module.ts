import { Module } from '@nestjs/common';
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
import { SentryModule } from '@sentry/nestjs/setup';
import { APP_FILTER } from '@nestjs/core';
import { SentryGlobalFilter } from '@sentry/nestjs/setup';

@Module({
  imports: [
    SentryModule.forRoot(),
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
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
  ],
  exports: [],
})
export class AppModule {}
