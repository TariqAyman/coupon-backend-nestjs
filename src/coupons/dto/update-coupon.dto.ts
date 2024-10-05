import { PartialType } from '@nestjs/mapped-types';
import { CreateCouponDto } from './create-coupon.dto';
import { IsNotEmpty, IsString, Validate } from 'class-validator';
import { IsUnique } from 'src/common/decorators/is-unique.decorator';
import { Coupon } from '../entities/coupon.entity';

export class UpdateCouponDto extends PartialType(CreateCouponDto) {
  @IsNotEmpty()
  @IsString()
  id: string;
}
