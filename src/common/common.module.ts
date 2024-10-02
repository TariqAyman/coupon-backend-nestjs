import { Module } from '@nestjs/common';
import { CurrentUserProvider } from './providers/current-user.provider';
import { ActionByUserSubscriber } from './subscribers/action-by-user.subscriber';
import { IsUniqueConstraint } from './validator/is-unique.constraint';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthInterceptor } from 'src/common/interceptor/auth.interceptor';
import { UsersModule } from 'src/users/users.module';
import { AuthenticationModule } from 'src/authentication/authentication.module';
import { ThrottlerModule } from '@nestjs/throttler';

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
    // AllExceptionsFilter,
  ],
  exports: [CurrentUserProvider, ActionByUserSubscriber],
})
export class CommonModule {}
