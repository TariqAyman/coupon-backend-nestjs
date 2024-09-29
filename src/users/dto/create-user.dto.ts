import {
  IsNotEmpty,
  IsEmail,
  IsOptional,
  IsEnum,
  IsDateString,
  IsPhoneNumber,
} from 'class-validator';
import { UserProvider } from '../../common/enums/UserProvider';
import { UserRole } from '../../common/enums/UserRole';
import { UserGender } from '../../common/enums/UserGender';
import { UserStatus } from 'src/common/enums/UserStatus';

export class CreateUserDto {
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsPhoneNumber('EG', { message: 'Phone number must be valid' })
  phoneNumber?: string;

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
