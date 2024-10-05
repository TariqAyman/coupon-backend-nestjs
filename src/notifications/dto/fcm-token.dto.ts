import { IsString, IsNotEmpty } from 'class-validator';

export class FCMTokenDto {
  @IsNotEmpty()
  @IsString()
  token: string;
}
