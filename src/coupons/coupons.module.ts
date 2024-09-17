import { Module } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { CouponsAdminService } from './coupons-admin.service';
import { CouponsAdminController } from './coupons-admin.controller';
import { IsUniqueConstraint } from 'src/common/validator/is-unique.constraint';

@Module({
  imports: [TypeOrmModule.forFeature([Coupon])],
  controllers: [CouponsController, CouponsAdminController],
  providers: [CouponsService, CouponsAdminService, IsUniqueConstraint],
})
export class CouponsModule {}
