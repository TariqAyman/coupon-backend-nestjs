import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Location } from '../../locations/entities/location.entity';
import { DeleteDateColumn } from 'typeorm';

export class CreateAdDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsUrl()
  link: string;

  @IsOptional()
  image?: string;

  @IsOptional()
  locations?: Location[];
}
