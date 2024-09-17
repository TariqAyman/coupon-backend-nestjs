import { PartialType } from '@nestjs/mapped-types';
import { CreateCouponDto } from './create-coupon.dto';
import { IsNotEmpty, Validate } from 'class-validator';
import { IsUnique } from 'src/common/decorators/is-unique.decorator';
import { Coupon } from '../entities/coupon.entity';
import { IsUniqueConstraint } from 'src/common/validator/is-unique.constraint';

export class UpdateCouponDto extends PartialType(CreateCouponDto) {
  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  @IsUnique(Coupon, 'code')
  code: string;
}
