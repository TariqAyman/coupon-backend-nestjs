import { IsString, IsNotEmpty } from 'class-validator';

export class NotificationDataDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  body: string;
}
