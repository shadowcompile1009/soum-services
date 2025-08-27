/* eslint-disable prettier/prettier */
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateNotificationRequest } from './dto/createNotificationRequest.dto';
import { CreateNotificationDto } from './dto/notification.dto';
import { ConsumerService } from '../../kafka/consumer.service';
import { NotificationService } from './notification.service';

@Injectable()
export class NotificationWebEngegeConsumer implements OnModuleInit {
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
          this.configService.get('kafka.PREFIX') +
            '-create-notification-webengage',
        ],
      },
      {
        eachMessage: async ({ topic, partition, message }) => {
          try {
            const data = JSON.parse(message.value.toString());
            await this.notificationService.sendEventData(data);
          } catch (error) {
            console.log(error);
            return;
          }
        },
      },
      'notification-webengege-kafka-' + this.configService.get('kafka.PREFIX'),
    );
  }
}
