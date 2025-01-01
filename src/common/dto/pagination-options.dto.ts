import {
  IsOptional,
  IsNumber,
  Min,
  IsString,
  IsEnum,
  IsBoolean,
  Max,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationOptionsDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number) // Transform string query params into numbers
  @Min(1)
  page: number = 1; // Default page number is 1

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit: number = 10; // Default limit is 10 items per page

  @IsOptional()
  @IsString()
  sortBy?: string | 'createdAt'; // Default sort field is 'createdAt'

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC';

  @IsOptional()
  @IsString()
  search: string; // Optional search query for filtering

  @IsOptional()
  @IsString()
  searchField: string; // Optional field to search by (e.g., 'name', 'description', etc.)

  @IsOptional()
  @IsString()
  relationFilterBy?: string; // Field to filter in relation

  @IsOptional()
  @IsString()
  relationFilterValue?: string; // Value to filter by in relation

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  simple?: boolean = false; // Simple response flag

  @IsOptional()
  hiddenRelationFilterBy?: string[]; // Field to filter in relation

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  simpleSelectFields?: string[]; // Fields to select in simple response

  @IsOptional()
  @IsString({ each: true })
  @IsArray()
  whereHas?: string[];
}
