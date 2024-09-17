import { IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number) // Transform string query params into numbers
  @Min(1)
  page: number = 1; // Default page number is 1

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  limit: number = 10; // Default limit is 10 items per page
}
