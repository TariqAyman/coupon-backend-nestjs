import { Module } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { CouponsAdminService } from './coupons-admin.service';
import { CouponsAdminController } from './coupons-admin.controller';
import { IsUniqueConstraint } from 'src/common/validator/is-unique.constraint';
import { UploadMediaModule } from 'src/upload-media/upload-media.module';
import { Category } from 'src/categories/entities/category.entity';
import { Brand } from 'src/brands/entities/brand.entity';
import { Country } from 'src/countries/entities/country.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Coupon, Country, Brand, Category, User]),
    UploadMediaModule,
    UsersModule,
  ],
  controllers: [CouponsController, CouponsAdminController],
  providers: [CouponsService, CouponsAdminService, IsUniqueConstraint],
})
export class CouponsModule {}
