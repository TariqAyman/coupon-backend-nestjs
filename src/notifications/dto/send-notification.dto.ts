import {
  IsString,
  IsNotEmpty,
  ValidateNested,
  IsIn,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationAction } from '../interfaces/push-notification.interface';
import { DataSendNotificationDto } from './data-send-notification.dto';

export class SendNotificationDto {
  @IsNotEmpty()
  @IsString()
  @IsIn([
    NotificationAction.singleDevice,
    NotificationAction.topic,
    NotificationAction.groupOfDevices,
  ])
  action: string; // Ensure you have the NotificationAction type defined elsewhere

  @IsOptional()
  @IsString()
  dateTime: string;

  @ValidateNested()
  @Type(() => DataSendNotificationDto) // Transform the nested DTO
  data: DataSendNotificationDto;
}
