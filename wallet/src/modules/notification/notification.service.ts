import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs';
import { ConfigService } from '@nestjs/config';
import { NotificationRequestEventDto } from '@src/modules/notification/dto/notificationrequest.dto';

@Injectable()
export class NotificationService implements OnModuleInit {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private configService: ConfigService) {}

  async onModuleInit() {}

  async createEventNotificationLog(
    eventLog: NotificationRequestEventDto,
  ): Promise<void> {
    const prefix = this.configService.get('notification.prefix');
    const kafka = new Kafka({
      brokers: this.configService.get('notification.brokers').split(','),
    });
    const producer: Producer = kafka.producer();
    await producer.connect();
    await producer.send({
      topic: prefix + '-create-notification',
      acks: 1,
      messages: [
        {
          key: eventLog.userId.toString(),
          value: JSON.stringify(eventLog),
        },
      ],
    });
    await producer.disconnect();
  }
}
