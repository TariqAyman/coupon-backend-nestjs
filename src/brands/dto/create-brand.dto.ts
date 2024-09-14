import { IsNotEmpty, IsUrl, IsOptional } from 'class-validator';

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
}
