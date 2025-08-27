import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CreateNotificationRequest } from './modules/notification/dto/createNotificationRequest.dto';
import { ProducerService } from './kafka/producer.service';

@Injectable()
export class AppService {
  constructor(
    private readonly producerService: ProducerService,
    private configService: ConfigService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async createNotification(createNotificationReq: CreateNotificationRequest) {
    await this.producerService.produce({
      topic: this.configService.get('kafka.PREFIX') + '-create-notification',
      acks: 1,
      messages: [
        {
          key: createNotificationReq.userId,
          value: JSON.stringify(createNotificationReq),
        },
      ],
    });
    return 'Create new notification log successful';
  }
}
