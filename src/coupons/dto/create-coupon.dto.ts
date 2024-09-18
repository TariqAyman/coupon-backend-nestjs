import {
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDateString,
  IsUrl,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IsUnique } from 'src/common/decorators/is-unique.decorator';
import { Coupon } from '../entities/coupon.entity';
import { BilingualString } from 'src/common/dto/bilingual-string.dto';
import { Type } from 'class-transformer';

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

  @IsOptional()
  @ValidateNested()
  @Type(() => BilingualString)
  seoDescription?: BilingualString;

  @IsOptional()
  @ValidateNested()
  @Type(() => BilingualString)
  seoKeywords?: BilingualString;

  @IsOptional()
  @ValidateNested()
  @Type(() => BilingualString)
  ogTitle?: BilingualString;

  @IsOptional()
  @ValidateNested()
  @Type(() => BilingualString)
  ogDescription?: BilingualString;

  @IsOptional()
  @IsUrl()
  ogImage?: string;

  @IsOptional()
  @IsUrl()
  ogUrl?: string;

  @IsOptional()
  @IsString()
  twitterCard?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => BilingualString)
  twitterTitle?: BilingualString;

  @IsOptional()
  @ValidateNested()
  @Type(() => BilingualString)
  twitterDescription?: BilingualString;

  @IsOptional()
  @IsUrl()
  twitterImage?: string;
}
