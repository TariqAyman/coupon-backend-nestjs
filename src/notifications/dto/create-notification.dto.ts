import { IsNotEmpty } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  title: { en: string; ar: string };

  @IsNotEmpty()
  body: { en: string; ar: string };
}
