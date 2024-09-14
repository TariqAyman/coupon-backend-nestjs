import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLocationDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  locationCode: string;

  @IsOptional()
  image?: string;
}
