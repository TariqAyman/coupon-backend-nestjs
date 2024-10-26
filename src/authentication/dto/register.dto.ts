import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsDate,
  IsPhoneNumber,
  Max,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserGender } from 'src/common/enums/UserGender';
import { UserProvider } from 'src/common/enums/UserProvider';
import { CountryCode } from 'libphonenumber-js/max';
import { IsPhoneNumberWithCountryCode } from 'src/common/validator/is-phone-number-with-Country-code';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

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

  @IsEnum(UserGender)
  gender: UserGender;

  @IsDate()
  @Type(() => Date)
  birthday: Date;

  @IsEnum(UserProvider)
  provider: UserProvider;

  @IsString()
  @IsNotEmpty()
  userLocale: string = 'en';
}
