import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  ValidateIf,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationDataDto } from './notification-data.dto';
import { NotificationAction } from '../interfaces/push-notification.interface';

export class DataSendNotificationDto {
  @ValidateNested()
  @IsNotEmpty()
  @Type(() => NotificationDataDto)
  notificationData: NotificationDataDto;

  @IsOptional()
  @IsString()
  token: string;

  @IsOptional()
  @IsString()
  topic: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  topics: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  groupOfDevices?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  groupOfUsers?: string[];
}
