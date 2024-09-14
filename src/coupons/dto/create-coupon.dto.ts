import { IsNotEmpty, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateCouponDto {
  @IsNotEmpty()
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
