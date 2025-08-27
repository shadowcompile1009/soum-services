/* eslint-disable prettier/prettier */
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateNotificationRequest } from './dto/createNotificationRequest.dto';
import { CreateNotificationDto } from './dto/notification.dto';
import { ConsumerService } from '../../kafka/consumer.service';
import { NotificationService } from './notification.service';

@Injectable()
export class NotificationConsumer implements OnModuleInit {
  constructor(
    @Inject(NotificationService)
    private readonly notificationService: NotificationService,
    private readonly consumerService: ConsumerService,
    private configService: ConfigService,
  ) {}
  async onModuleInit() {
    await this.consumerService.consume(
      {
        topics: [
          this.configService.get('kafka.PREFIX') + '-create-notification',
        ],
      },
      {
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const creatingNotificationReq: CreateNotificationRequest =
              JSON.parse(message.value.toString());
            creatingNotificationReq.topic = topic.toString();
            await this.createNotificationLog(creatingNotificationReq);
          } catch (error) {
            console.log(error);
            return;
          }
        },
      },
      'notification-kafka-' + this.configService.get('kafka.PREFIX'),
    );
  }
  async createNotificationLog(
    creatingNotificationReq: CreateNotificationRequest,
  ) {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        const body: CreateNotificationDto = {
          eventType: creatingNotificationReq.eventType,
          messageTitle: creatingNotificationReq.messageTitle,
          messageBody: creatingNotificationReq.messageBody,
          userId: creatingNotificationReq.userId,
          platform: creatingNotificationReq.platform,
          service: creatingNotificationReq.service,
          isRead: false,
        };
        await this.notificationService.create(body);
        resolve(true);
      } catch (error) {
        console.log(error);
        reject(false);
      }
    });
  }
}
