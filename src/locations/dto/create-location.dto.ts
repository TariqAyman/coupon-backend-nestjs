import { IsNotEmpty, IsOptional } from 'class-validator';
import { IsUnique } from 'src/common/decorators/is-unique.decorator';
import { Location } from '../entities/location.entity';

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
}
