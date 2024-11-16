import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  ValidateIf,
  IsEnum,
  MaxLength,
} from 'class-validator';
import { CountryCode } from 'libphonenumber-js/max';
import { IsPhoneNumberWithCountryCode } from 'src/common/validator/is-phone-number-with-Country-code';

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @IsEnum(['email', 'phone'])
  loginMethod: 'email' | 'phone';

  @ValidateIf((o) => o.loginMethod === 'email')
  @ValidateIf((o) => o.loginMethod === 'phone')
  @IsString()
  @IsEmail({}, { message: 'Enter a valid email address' })
  @MinLength(5, { message: 'Email must be at least 5 characters long' })
  @IsPhoneNumberWithCountryCode('phoneNumberCountryCode', {
    message: 'Invalid phone number for the provided country code',
  })
  identifier: string;

  @ValidateIf((o) => o.loginMethod === 'phone')
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(3)
  phoneNumberCountryCode: CountryCode;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}
