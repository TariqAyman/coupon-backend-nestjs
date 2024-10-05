import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsAdminController } from './notifications-admin.controller';
import { NotificationsAdminService } from './notifications-admin.service';
import { Notification } from './entities/notification.entity';
import { PushNotificationController } from './push-notification.controller';
import { PushNotificationService } from './push-notification.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as admin from 'firebase-admin';
import { User } from 'src/users/entities/user.entity';
import { UserToken } from './entities/user-tokens.entity';

const firebaseProvider = {
  provide: 'FIREBASE_APP',
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => {
    const serviceAccount = require('../../firebase-admin-sdk.json');

    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${serviceAccount.projectId}.firebaseio.com`,
      storageBucket: `${serviceAccount.projectId}.appspot.com`,
    });
  },
};

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Notification, User, UserToken]),
  ],
  controllers: [
    NotificationsController,
    NotificationsAdminController,
    PushNotificationController,
  ],
  providers: [
    NotificationsService,
    NotificationsAdminService,
    PushNotificationService,
    firebaseProvider,
  ],
  exports: [NotificationsService, PushNotificationService],
})
export class NotificationsModule {}
