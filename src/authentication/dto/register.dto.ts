import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsDate,
  IsPhoneNumber,
  MaxLength,
  MinLength,
  ValidateIf,
  IsOptional,
} from 'class-validator';
import { UserGender } from 'src/common/enums/UserGender';
import { UserProvider } from 'src/common/enums/UserProvider';
import { CountryCode } from 'libphonenumber-js/max';
import { IsPhoneNumberWithCountryCode } from 'src/common/validator/is-phone-number-with-Country-code';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(['email', 'phone'])
  registerMethod: 'email' | 'phone';

  @ValidateIf((o) => o.registerMethod === 'email')
  @IsEmail()
  @IsNotEmpty()
  email?: string;

  @ValidateIf((o) => o.registerMethod === 'phone')
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumberWithCountryCode('phoneNumberCountryCode', {
    message: 'Invalid phone number for the provided country code',
  })
  phoneNumber?: string;

  @ValidateIf((o) => o.loginMethod === 'phone')
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(3)
  phoneNumberCountryCode: CountryCode;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsOptional()
  @IsEnum(UserGender)
  gender: UserGender;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birthday: Date;

  @IsEnum(UserProvider)
  provider: UserProvider = UserProvider.System;

  @IsString()
  @IsNotEmpty()
  userLocale: string = 'en';
}
