import { IsNotEmpty, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';
import { IsUnique } from 'src/common/decorators/is-unique.decorator';
import { Location } from '../entities/location.entity';
import { Type } from 'class-transformer';
import { BilingualString } from 'src/common/dto/bilingual-string.dto';

export class CreateLocationDto {
  @IsNotEmpty()
  @IsUnique(Location, 'name')
  name: string;

  @IsNotEmpty()
  locationCode: string;

  @IsNotEmpty()
  latitude?: string;

  @IsNotEmpty()
  longitude?: string;

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
