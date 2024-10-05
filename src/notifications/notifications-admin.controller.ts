import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationsAdminService } from './notifications-admin.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/common/enums/UserRole';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { SendNotificationInterface } from './interfaces/push-notification.interface';
import { PushNotificationService } from './push-notification.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Admin)
@Controller('admin/notifications')
export class NotificationsAdminController {
  constructor(
    private readonly notificationsService: NotificationsAdminService,
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  @Post('push-notification')
  sendPushNotification(
    @Body() data: SendNotificationInterface | SendNotificationInterface[],
  ) {
    if (Array.isArray(data)) {
      for (const item of data)
        this.pushNotificationService.sendPushNotification(item);
    } else {
      return this.pushNotificationService.sendPushNotification(
        data as SendNotificationInterface,
      );
    }
  }

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }
}
