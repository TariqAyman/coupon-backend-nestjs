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
  @IsEmail({}, { message: 'Enter a valid email address' })
  @IsNotEmpty()
  @MinLength(5, { message: 'Email must be at least 5 characters long' })
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
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string;
}
