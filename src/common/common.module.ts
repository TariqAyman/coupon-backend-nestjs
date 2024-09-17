import { Module } from '@nestjs/common';
import { CurrentUserProvider } from './providers/current-user.provider';
import { ActionByUserSubscriber } from './subscribers/action-by-user.subscriber';
import { IsUniqueConstraint } from './validator/is-unique.constraint';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthInterceptor } from 'src/common/interceptor/auth.interceptor';
import { UsersModule } from 'src/users/users.module';
import { AuthenticationModule } from 'src/authentication/authentication.module';

@Module({
  imports: [AuthenticationModule, UsersModule],
  providers: [
    CurrentUserProvider,
    ActionByUserSubscriber,
    IsUniqueConstraint,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuthInterceptor,
    },
    // AllExceptionsFilter,
  ],
  exports: [CurrentUserProvider, ActionByUserSubscriber],
})
export class CommonModule {}
