import { IsNotEmpty, IsOptional, IsNumber, IsDateString } from 'class-validator';
import { IsUnique } from 'src/common/decorators/is-unique.decorator';
import { Coupon } from '../entities/coupon.entity';

export class CreateCouponDto {
  @IsNotEmpty()
  @IsUnique(Coupon, 'code', { message: 'Coupon code must be unique' })
  code: string;

  @IsNumber()
  amount: number;

  @IsNotEmpty()
  status: { en: string; ar: string };

  @IsOptional()
  description?: { en: string; ar: string };

  @IsOptional()
  @IsDateString()
  expire?: Date;

  @IsOptional()
  qrCode?: string;

  @IsOptional()
  link?: string;
}
