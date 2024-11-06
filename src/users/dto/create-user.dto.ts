import {
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsEnum,
  IsDateString,
  IsPhoneNumber,
  IsString,
  MinLength,
  MaxLength,
  IsDate,
} from 'class-validator';
import { UserProvider } from '../../common/enums/UserProvider';
import { UserRole } from '../../common/enums/UserRole';
import { UserGender } from '../../common/enums/UserGender';
import { UserStatus } from 'src/common/enums/UserStatus';
import { IsPhoneNumberWithCountryCode } from 'src/common/validator/is-phone-number-with-Country-code';
import { CountryCode } from 'libphonenumber-js/max';
import { Type } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumberWithCountryCode('phoneNumberCountryCode', {
    message: 'Invalid phone number for the provided country code',
  })
  phoneNumber?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(3)
  phoneNumberCountryCode: CountryCode;

  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birthday?: Date;

  @IsOptional()
  @IsEnum(UserGender)
  gender: UserGender;

  @IsOptional()
  @IsEnum(UserStatus)
  status!: UserStatus;

  @IsString()
  @IsNotEmpty()
  userLocale: string = 'en';
}
