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
} from 'class-validator';
import { UserProvider } from '../../common/enums/UserProvider';
import { UserRole } from '../../common/enums/UserRole';
import { UserGender } from '../../common/enums/UserGender';
import { UserStatus } from 'src/common/enums/UserStatus';
import { IsPhoneNumberWithCountryCode } from 'src/common/validator/is-phone-number-with-Country-code';
import { CountryCode } from 'libphonenumber-js/max';

export class CreateUserDto {
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsPhoneNumberWithCountryCode('phoneNumberCountryCode', {
    message: 'Invalid phone number for the provided country code',
  })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(3)
  phoneNumberCountryCode: CountryCode;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsDateString()
  birthday?: Date;

  @IsOptional()
  @IsEnum(UserGender)
  gender?: UserGender;

  @IsEnum(UserProvider)
  provider: UserProvider;

  @IsOptional()
  @IsEnum(UserStatus)
  status!: UserStatus;

  @IsOptional()
  joined!: Date;
}
