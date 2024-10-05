import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationDataDto } from './notification-data.dto'; // Import the NotificationDataDto
import { NotificationAction } from '../interfaces/push-notification.interface';

export class SendNotificationDto {
  @IsNotEmpty()
  @IsString()
  action: NotificationAction; // Ensure you have the NotificationAction type defined elsewhere

  @IsNotEmpty()
  @IsString()
  dateTime: string;

  @ValidateNested()
  @Type(() => NotificationDataDto) // Transform the nested DTO
  data: SendNotificationDto;
}
