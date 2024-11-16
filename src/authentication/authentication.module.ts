import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UsersModule } from 'src/users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { jwtConstants } from './constants';
import { GoogleStrategy } from './strategy/google.strategy';
import { AuthenticationGoogleController } from './authentication-google.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { ResetPasswordToken } from './entities/reset-password-token.entity';
import { MailService } from 'src/common/services/mail.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
    TypeOrmModule.forFeature([RefreshToken, ResetPasswordToken]),
  ],
  controllers: [AuthenticationController, AuthenticationGoogleController],
  providers: [
    AuthenticationService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    MailService,
  ],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
