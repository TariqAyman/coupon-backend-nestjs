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

@Module({
  imports: [TypeOrmModule.forFeature([User, Brand, Coupon]), UploadMediaModule],
  controllers: [UsersController, UsersAdminController],
  providers: [UsersService, UsersAdminService],
  exports: [UsersService],
})
export class UsersModule {}
