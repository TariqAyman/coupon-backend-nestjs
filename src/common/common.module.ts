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
import { MailService } from './services/mail.service';
import { ConfigModule } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { JwtAuthOrGuestGuard } from './guards/jwt-auth-or-guest.guard';
import { JwtStrategy } from 'src/authentication/strategy/jwt.strategy';
import { LocalStrategy } from 'src/authentication/strategy/local.strategy';
import { jwtConstants } from 'src/authentication/constants';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
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
    ConfigModule,
  ],
  providers: [
    LocalStrategy,
    JwtStrategy,
    CurrentUserProvider,
    ActionByUserSubscriber,
    IsUniqueConstraint,
    MailService,
  ],
  exports: [CurrentUserProvider, ActionByUserSubscriber, MailService],
})
export class CommonModule {}
