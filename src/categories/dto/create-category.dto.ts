import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  name: { en: string; ar: string };

  @IsNotEmpty()
  slug: { en: string; ar: string };

  @IsOptional()
  description?: { en: string; ar: string };

  @IsOptional()
  image?: string;

  @IsOptional()
  icon?: string;

  @IsOptional()
  color?: string;
}
