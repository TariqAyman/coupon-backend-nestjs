import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { SubscribeTopicInterface } from './interfaces/subscribe-topic.interface';
import { NewSubscriberInterface } from './interfaces/subscriber.interface';
import { FCMToken } from './interfaces/token.interface';
import { PushNotificationService } from './push-notification.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { NewSubscriberDto } from './dto/new-subscriber.dto';
import { SubscribeTopicDto } from './dto/subscribe-topic.dto';
import { FCMTokenDto } from './dto/fcm-token.dto';
import { UnSubscribeTopicDto } from './dto/unsubscribe-topic.dto';
import { success } from 'src/common/utils/api-response-wrapper';

@UseGuards(JwtAuthGuard)
@Controller('push-notification')
export class PushNotificationController {
  constructor(
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  @Post('new-subscriber')
  async addNewSubscribe(@Req() req: Request, @Body() data: NewSubscriberDto) {
    const user = (req as any).user as User;
    const response = await this.pushNotificationService.addNewSubscribe(
      user.id,
      data,
    );
    return success(response);
  }

  @Post('subscribe-topic')
  async subscribeToTopic(@Req() req: Request, @Body() data: SubscribeTopicDto) {
    const user = (req as any).user as User;
    const response = this.pushNotificationService.subscribeToTopic(
      user.id,
      data,
    );
    return success(response);
  }

  @Post('unsubscribe-topic')
  async unsubscribeFromTopic(
    @Req() req: Request,
    @Body() data: SubscribeTopicInterface,
  ) {
    const user = (req as any).user as User;
    const response = await this.pushNotificationService.unsubscribeFromTopic(
      user.id,
      data,
    );
    return success(response);
  }

  @Post('revoke-token')
  async revokeUserToken(
    @Req() req: Request,
    @Body() data: UnSubscribeTopicDto,
  ) {
    const response = await this.pushNotificationService.revokeUserToken(
      data.token,
    );
    return success(response);
  }

  @Post('check-fcm-token')
  async isValidFCMToken(
    @Req() req: Request,
    @Body() data: FCMTokenDto,
  ): Promise<void> {
    await this.pushNotificationService.checkFCMToken(data);
  }
}
