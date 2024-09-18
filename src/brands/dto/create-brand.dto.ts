import { Type } from 'class-transformer';
import { IsNotEmpty, IsUrl, IsOptional, IsString, ValidateNested } from 'class-validator';
import { BilingualString } from 'src/common/dto/bilingual-string.dto';

export class CreateBrandDto {
  @IsNotEmpty()
  name: { en: string; ar: string };

  @IsNotEmpty()
  slug: string;

  @IsOptional()
  description?: { en: string; ar: string };

  @IsUrl()
  link: string;

  @IsOptional()
  image?: string;

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
