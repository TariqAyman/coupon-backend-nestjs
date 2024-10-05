import { Injectable, OnModuleInit } from '@nestjs/common';
import {
  NotificationAction,
  NotificationDataInterface,
  SendNotificationInterface,
} from './interfaces/push-notification.interface';
import { NewSubscriberInterface } from './interfaces/subscriber.interface';
import * as admin from 'firebase-admin';
import { SubscribeTopicInterface } from './interfaces/subscribe-topic.interface';
import { FCMToken } from './interfaces/token.interface';
import { Cron } from '@nestjs/schedule';
import { checkFCMTopicPattern } from './helpers';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from './entities/user-tokens.entity';

@Injectable()
export class PushNotificationService {
  constructor(
    @InjectRepository(UserToken)
    private readonly userTokensRepository: Repository<UserToken>,
  ) {}

  async addNewSubscribe(userId: string, data: NewSubscriberInterface) {
    const subscribeTopics = [
      data.os,
      data.osVersion,
      data.model,
      data.country,
      data.location,
    ];

    const topics: string[] = [];

    const promises = subscribeTopics.map((item) => {
      if (item && checkFCMTopicPattern(item)) {
        topics.push(item);
        return admin.messaging().subscribeToTopic(data.token, item);
      }
    });

    await Promise.all(promises);

    try {
      const userToken = await this.userTokensRepository.findOne({
        where: { token: data.token },
      });

      if (userToken) {
        await this.userTokensRepository.update(
          { id: userToken.id },
          {
            userId: userId,
            os: data.os,
            osVersion: data.osVersion,
            model: data.model,
            country: data.country,
            location: data.location,
            topics,
          },
        );
      } else {
        await this.userTokensRepository.save({
          userId: userId,
          token: data.token,
          os: data.os,
          osVersion: data.osVersion,
          model: data.model,
          country: data.country,
          location: data.location,
          topics,
        });
      }
    } catch (err) {}
  }

  async sendPushNotification(data: SendNotificationInterface) {
    if (data.action === NotificationAction.singleDevice)
      return await this.sendToSingleDevice(
        data.data.token as string,
        data.data.notificationData,
      );
    else if (data.action === NotificationAction.topic)
      return await this.sendToSpecificTopic(
        data.data.token as string,
        data.data.notificationData,
      );
    else if (data.action === NotificationAction.groupOfDevices)
      return await this.sendToGroupOfDevices(
        data.data.groupOfDevices as string[],
        data.data.notificationData,
      );
  }

  async subscribeToTopic(userId: string, data: SubscribeTopicInterface) {
    const fcmUser = await this.userTokensRepository.findOneBy({
      token: data.token,
    });

    try {
      await admin.messaging().subscribeToTopic(data.token, data.topic);
      if (fcmUser) {
        await this.userTokensRepository.update(
          { id: fcmUser.id },
          {
            topics: [...fcmUser.topics, data.topic],
            updatedAt: new Date(),
          },
        );
      }
    } catch (err) {}
  }

  async unsubscribeFromTopic(userId: string, data: SubscribeTopicInterface) {
    const fcmUser = await this.userTokensRepository.findOneBy({
      token: data.token,
    });
    try {
      await admin.messaging().unsubscribeFromTopic(data.token, data.topic);
      if (fcmUser) {
        await this.userTokensRepository.update(
          { id: fcmUser.id },
          {
            topics: fcmUser.topics.filter((item) => item !== data.topic),
            updatedAt: new Date(),
          },
        );
      }
    } catch (err) {}
  }

  async revokeUserToken(userId: string | undefined, token: string) {
    const fcmUser = await this.userTokensRepository.findOneBy({ token });
    if (fcmUser) {
      try {
        await Promise.all(
          fcmUser.topics.map((topic: string) =>
            admin.messaging().unsubscribeFromTopic(token, topic),
          ),
        );
        await this.userTokensRepository.update(
          { id: fcmUser.id },
          { deletedAt: new Date(), topics: [] },
        );
      } catch (err) {}
    }
  }

  async sendToSingleDevice(token: string, data: NotificationDataInterface) {
    try {
      await admin.messaging().sendToDevice(token, {
        notification: { title: data.title, body: data.body, sound: 'default' },
      });
    } catch (err) {}
  }

  async sendToSpecificTopic(topic: string, data: NotificationDataInterface) {
    try {
      await admin.messaging().sendToTopic(topic, {
        notification: { title: data.title, body: data.body, sound: 'default' },
      });
    } catch (err) {}
  }

  async sendToGroupOfDevices(
    tokens: string[],
    data: NotificationDataInterface,
  ) {
    try {
      await admin
        .messaging()
        .sendMulticast({
          tokens,
          notification: { title: data.title, body: data.body },
          android: { notification: { defaultSound: true, priority: 'high' } },
          apns: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            headers: { 'apns-priority': '10' },
            payload: { aps: { sound: 'default' } },
          },
        })
        .then((result) => {
          // result.responses.forEach((resp, idx) => {
          //   if (!resp.success) {
          //     // check if this valid token
          //     this.checkFCMToken({ token: tokens[idx] });
          //   }
          // });
        });
    } catch (err) {}
  }

  @Cron('0 18 * * *')
  async checkFCMToken(userId?: string, data?: FCMToken): Promise<void> {
    if (data !== undefined) {
      if (!(await this.isValidFCMToken(data.token))) {
        this.revokeUserToken(undefined,data.token);
      }
    } else {
      this.handleIsValidFCMTokenCronJob();
    }
  }

  async isValidFCMToken(token: string): Promise<boolean> {
    let isValid = false;
    const message = {
      data: {
        score: '1',
        time: '12:00',
      },
      token,
    };

    try {
      await admin.messaging().send(message, true);
      isValid = true;
    } catch (error) {}
    return isValid;
  }

  async handleIsValidFCMTokenCronJob() {
    const [tokens, total] = await this.userTokensRepository.findBy({
      deletedAt: undefined,
    });

    // tokens?.map(async (subscriber: UserToken) => {
    //   if (!(await this.isValidFCMToken(subscriber.token))) {
    //     this.revokeUserToken(subscriber.token);
    //   }
    // });
  }
}
