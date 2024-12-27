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
    NotificationAction.all,
    NotificationAction.singleDevice,
    NotificationAction.topic,
    NotificationAction.topics,
    NotificationAction.groupOfDevices,
    NotificationAction.groupOfUsers,
  ])
  action: string;

  @IsOptional()
  @IsString()
  dateTime: string;

  @ValidateNested({ each: true })
  @Type(() => DataSendNotificationDto) // Transform the nested DTO
  data: DataSendNotificationDto;
}
