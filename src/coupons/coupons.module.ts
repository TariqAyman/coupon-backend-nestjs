import { Module } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { CouponsController } from './coupons.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { CouponsAdminService } from './coupons-admin.service';
import { CouponsAdminController } from './coupons-admin.controller';
import { IsUniqueConstraint } from 'src/common/validator/is-unique.constraint';
import { UploadMediaModule } from 'src/upload-media/upload-media.module';

@Module({
  imports: [TypeOrmModule.forFeature([Coupon]), UploadMediaModule],
  controllers: [CouponsController, CouponsAdminController],
  providers: [CouponsService, CouponsAdminService, IsUniqueConstraint],
})
export class CouponsModule {}
