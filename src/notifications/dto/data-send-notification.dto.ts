import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { NotificationDataDto } from './notification-data.dto';

export class DataSendNotificationDto {
  @ValidateNested()
  @Type(() => NotificationDataDto)
  notificationData: NotificationDataDto;

  @IsOptional()
  @IsString()
  token: string;

  @IsOptional()
  @IsString()
  topic?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  groupOfDevices?: string[];
}
