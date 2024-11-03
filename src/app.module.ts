import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
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
import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  I18nService,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import { LocaleSubscriber } from './common/subscribers/locale.subscriber';
import { LocaleMiddleware } from './common/middleware/locale.middleware';
import { YcI18nService } from './common/yc-i18n/yc-i18n.service';
import { LoggerMiddleware } from './common/middleware/log.middleware';
import { AppLoggerMiddleware } from './common/middleware/app-log.middleware';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    SentryModule.forRoot(),
    I18nModule.forRoot({
      fallbackLanguage: '',
      loaderOptions: {
        path: path.join(__dirname, '/locales/'),
        watch: true,
      },
      typesOutputPath: path.join(
        __dirname,
        '../src/generated/i18n.generated.ts',
      ),
      resolvers: [
        new QueryResolver(['lang']),
        AcceptLanguageResolver,
        new HeaderResolver([
          'x-locale',
          'x-language',
          'x-lang',
          'Accept-Language',
        ]),
      ],
    }),
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
    DashboardModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: SentryGlobalFilter,
    },
    LocaleSubscriber,
    YcI18nService,
  ],
  exports: [LocaleSubscriber, YcI18nService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware, AppLoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL }); // Apply globally
  }
}
