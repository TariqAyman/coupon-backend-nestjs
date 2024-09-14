import { IsNotEmpty } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  header: { en: string; ar: string };

  @IsNotEmpty()
  body: { en: string; ar: string };
}
