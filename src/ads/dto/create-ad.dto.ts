import { IsNotEmpty, IsOptional, IsUrl } from 'class-validator';
import { User } from '../../users/entities/user.entity';
import { Location } from '../../locations/entities/location.entity';

export class CreateAdDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsUrl()
  link: string;

  @IsOptional()
  image?: string;

  @IsNotEmpty()
  createdBy: User;

  @IsOptional()
  updatedBy?: User;

  @IsOptional()
  locations?: Location[];

  @IsOptional()
  isDeleted?: boolean;
}
