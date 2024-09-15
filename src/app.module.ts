import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AdsModule } from './ads/ads.module';
import { BrandsModule } from './brands/brands.module';
import { CategoriesModule } from './categories/categories.module';
import { CouponsModule } from './coupons/coupons.module';
import { LocationsModule } from './locations/locations.module';
import { NotificationsModule } from './notifications/notifications.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { DatabaseModule } from './database/database.module';
import databaseConfig from './database/typeorm.config';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [databaseConfig] }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60, // Time to live in seconds
          limit: 10, // Max number of requests in the TTL
        },
      ],
    }),
    DatabaseModule,
    AdsModule,
    UsersModule,
    BrandsModule,
    CategoriesModule,
    CouponsModule,
    LocationsModule,
    NotificationsModule,
    AuthenticationModule,
  ],
  controllers: [],
  providers: [{
    provide: APP_INTERCEPTOR,
    useClass: AuthInterceptor,
  }],
})
export class AppModule {}
