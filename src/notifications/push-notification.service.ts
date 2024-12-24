import { Injectable, OnModuleInit } from '@nestjs/common';
import { NotificationAction } from './interfaces/push-notification.interface';
import { NewSubscriberInterface } from './interfaces/subscriber.interface';
import * as admin from 'firebase-admin';
import { SubscribeTopicInterface } from './interfaces/subscribe-topic.interface';
import { FCMToken } from './interfaces/token.interface';
import { Cron } from '@nestjs/schedule';
import { checkFCMTopicPattern } from './helpers';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserToken } from './entities/user-tokens.entity';
import { SendNotificationDto } from './dto/send-notification.dto';
import { NotificationDataDto } from './dto/notification-data.dto';

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
    } catch (err) {
      throw err;
    }
  }

  async sendPushNotification(data: SendNotificationDto) {
    if (data.action === NotificationAction.singleDevice)
      return await this.sendToSingleDevice(
        data.data.token as string,
        data.data.notificationData,
      );
    else if (data.action === NotificationAction.topic)
      return await this.sendToSpecificTopic(
        data.data.topic as string,
        data.data.notificationData,
      );
    else if (data.action === NotificationAction.topics)
      return await this.sendToGroupOfTopics(
        data.data.topics as string[],
        data.data.notificationData,
      );
    else if (data.action === NotificationAction.groupOfDevices)
      return await this.sendToGroupOfDevices(
        data.data.groupOfDevices as string[],
        data.data.notificationData,
      );
    else if (data.action === NotificationAction.groupOfUsers)
      return await this.sendToGroupOfUsers(
        data.data.groupOfUsers as string[],
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
    } catch (err) {
      throw err;
    }
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
    } catch (err) {
      throw err;
    }
  }

  async revokeUserToken(token: string) {
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
      } catch (err) {
        throw err;
      }
    }
  }

  async sendToSingleDevice(token: string, data: NotificationDataDto) {
    try {
      const user = await this.userTokensRepository.findOneBy({ token });

      const message: admin.messaging.Message = {
        token: token,
        notification: {
          title: data.title.ar,
          body: data.body.ar,
        },
        android: {
          notification: {
            sound: 'default',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
            },
          },
        },
      };

      await admin.messaging().send(message);
    } catch (err) {
      console.error('Error sending notification:', err);
    }
  }

  async sendToSpecificTopic(topic: string, data: NotificationDataDto) {
    try {
      const message: admin.messaging.Message = {
        topic: topic,
        notification: {
          title: data.title.ar,
          body: data.body.ar,
        },
        android: {
          notification: {
            sound: 'default',
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
            },
          },
        },
      };

      await admin.messaging().send(message);
      console.log(
        'Notification sent to topic:',
        await admin.messaging().send(message),
      );
    } catch (err) {
      console.error('Error sending notification to topic:', err);
    }
  }

  async sendToGroupOfTopics(topics: string[], data: NotificationDataDto) {
    try {
      for (const topic of topics) {
        const message: admin.messaging.Message = {
          topic: topic,
          notification: {
            title: data.title.ar,
            body: data.body.ar,
          },
          android: {
            notification: {
              sound: 'default',
            },
          },
          apns: {
            payload: {
              aps: {
                sound: 'default',
              },
            },
          },
        };

        await admin.messaging().send(message);
      }
    } catch (err) {
      console.error('Error sending notification to topic:', err);
    }
  }

  async sendToGroupOfDevices(tokens: string[], data: NotificationDataDto) {
    try {
      const message: admin.messaging.MulticastMessage = {
        tokens: tokens,
        notification: {
          title: data.title.ar,
          body: data.body.ar,
        },
        android: {
          notification: {
            sound: 'default',
            priority: 'high',
          },
        },
        apns: {
          headers: {
            'apns-priority': '10',
          },
          payload: {
            aps: {
              sound: 'default',
            },
          },
        },
      };

      const result = await admin.messaging().sendEachForMulticast(message);

      result.responses.forEach((resp, idx) => {
        if (!resp.success) {
          console.error(`Failed to send to ${tokens[idx]}:`, resp.error);
          this.checkFCMToken({ token: tokens[idx] });
        }
      });
    } catch (err) {
      console.error('Error sending notification to group of devices:', err);
    }
  }

  async sendToGroupOfUsers(usersIds: string[], data: NotificationDataDto) {
    try {
      // get all tokens for users ids
      const usersTokens = await this.userTokensRepository.find({
        where: {
          user: {
            id: In(usersIds),
          },
        },
        select: {
          token: true,
        },
      });

      const tokens = usersTokens.map((item) => item.token);

      const message: admin.messaging.MulticastMessage = {
        tokens: tokens,
        notification: {
          title: data.title.ar,
          body: data.body.ar,
        },
        android: {
          notification: {
            sound: 'default',
            priority: 'high',
          },
        },
        apns: {
          headers: {
            'apns-priority': '10',
          },
          payload: {
            aps: {
              sound: 'default',
            },
          },
        },
      };

      const result = await admin.messaging().sendEachForMulticast(message);

      result.responses.forEach((resp, idx) => {
        if (!resp.success) {
          console.error(`Failed to send to ${tokens[idx]}:`, resp.error);
          this.checkFCMToken({ token: tokens[idx] });
        }
      });
    } catch (err) {
      console.error('Error sending notification to group of devices:', err);
    }
  }

  @Cron('0 18 * * *')
  async checkFCMToken(data?: FCMToken): Promise<void> {
    if (data !== undefined) {
      if (!(await this.isValidFCMToken(data.token))) {
        this.revokeUserToken(data.token);
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
    } catch (error) {
      throw error;
    }
    return isValid;
  }

  async handleIsValidFCMTokenCronJob() {
    try {
      const tokens = await this.userTokensRepository.findBy({
        deletedAt: undefined,
      });

      await Promise.all(
        tokens.map(async (subscriber: UserToken) => {
          try {
            if (!(await this.isValidFCMToken(subscriber.token))) {
              await this.revokeUserToken(subscriber.token);
            }
          } catch (innerError) {
            console.error(
              `Error processing token ${subscriber.token}:`,
              innerError,
            );
          }
        }),
      );
    } catch (error) {
      console.error('Error fetching tokens:', error);
    }
  }

  async findTopics() {
    const topics = await this.userTokensRepository.query(`
    SELECT DISTINCT topic 
    FROM user_tokens, 
         JSON_TABLE(user_tokens.topics, '$[*]' COLUMNS (topic VARCHAR(255) PATH '$')) AS topics_table
  `);

    // Extract the 'topic' values and return as a single array
    const uniqueTopics = topics.map((row: any) => row.topic);

    return uniqueTopics;
  }

  createMessage(
    token: string,
    data: NotificationDataDto,
  ): admin.messaging.Message {
    return {
      token: token,
      notification: {
        title: data.title.ar,
        body: data.body.ar,
      },
      android: {
        notification: {
          sound: 'default',
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
          },
        },
      },
    };
  }
}
