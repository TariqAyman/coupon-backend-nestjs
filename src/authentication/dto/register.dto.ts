import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsDate,
  IsPhoneNumber,
} from 'class-validator';
import { UserGender } from 'src/common/enums/UserGender';
import { UserProvider } from 'src/common/enums/UserProvider';

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
  @IsPhoneNumber('EG', { message: 'Phone number must be valid' })
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  avatar: string;

  @IsEnum(UserGender)
  gender: UserGender;

  @IsDate()
  @Type(() => Date)
  birthday: Date;

  @IsEnum(UserProvider)
  provider: UserProvider;
}
