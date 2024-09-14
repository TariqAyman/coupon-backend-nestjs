import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @MinLength(5)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}
