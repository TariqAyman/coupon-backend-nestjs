import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { UsersAdminController } from './users-admin.controller';
import { UsersAdminService } from './users-admin.service';
import { Brand } from 'src/brands/entities/brand.entity';
import { Coupon } from '../coupons/entities/coupon.entity';
import { UploadMediaModule } from 'src/upload-media/upload-media.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/authentication/constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Brand, Coupon]),
    UploadMediaModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
  ],
  controllers: [UsersController, UsersAdminController],
  providers: [UsersService, UsersAdminService],
  exports: [UsersService, UsersAdminService],
})
export class UsersModule {}
