import { Module } from '@nestjs/common';
import { CurrentUserProvider } from './providers/current-user.provider';
import { ActionByUserSubscriber } from './subscribers/action-by-user.subscriber';
import { IsUniqueConstraint } from './validator/is-unique.constraint';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { UsersModule } from 'src/users/users.module';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { LocaleSubscriber } from './subscribers/locale.subscriber';
import { YcI18nService } from './yc-i18n/yc-i18n.service';
import { I18nService } from 'nestjs-i18n';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60, // Time to live in seconds
          limit: 10, // Max number of requests in the TTL
        },
      ],
    }),
    AuthenticationModule,
    UsersModule,
  ],
  providers: [
    CurrentUserProvider,
    ActionByUserSubscriber,
    IsUniqueConstraint,

  ],
  exports: [
    CurrentUserProvider,
    ActionByUserSubscriber,
  ],
})
export class CommonModule {}
