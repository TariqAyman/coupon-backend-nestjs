import { PartialType } from '@nestjs/mapped-types';
import { CreateCountryDto } from './create-country.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateCountryDto extends PartialType(CreateCountryDto) {
  @IsNotEmpty()
  id: string;
}
