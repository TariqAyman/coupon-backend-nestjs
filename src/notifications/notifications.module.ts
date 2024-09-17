import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsAdminController } from './notifications-admin.controller';
import { NotificationsAdminService } from './notifications-admin.service';
import { Notification } from './entities/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  controllers: [NotificationsController, NotificationsAdminController],
  providers: [NotificationsService, NotificationsAdminService],
})
export class NotificationsModule {}
