import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationsAdminService } from './notifications-admin.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserRole } from 'src/common/enums/UserRole';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { PushNotificationService } from './push-notification.service';
import { SendNotificationDto } from './dto/send-notification.dto';
import { success } from 'src/common/utils/api-response-wrapper';
import { UsersAdminService } from 'src/users/users-admin.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Admin)
@Controller('admin/notifications')
export class NotificationsAdminController {
  constructor(
    private readonly notificationsService: NotificationsAdminService,
    private readonly pushNotificationService: PushNotificationService,
    private readonly usersAdminService: UsersAdminService,
  ) {}

  @Post('push-notification')
  async sendPushNotification(@Body() data: SendNotificationDto) {
    this.pushNotificationService.sendPushNotification(data);

    return success('Push notification sent successfully');
  }

  @Post()
  create(@Body() createNotificationDto: CreateNotificationDto) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Get()
  findAll() {
    return this.notificationsService.findAll();
  }

  @Get('topics')
  async findTopics() {
    const topics = await this.pushNotificationService.findTopics();

    return success(topics);
  }

  @Get('users')
  async getUsersHasTokens() {
    const users = await this.usersAdminService.getUsersHasTokens();

    return success(users);
  }
}
