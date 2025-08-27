import {
  Injectable,
  OnModuleInit,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductProducerService
  implements OnModuleInit, OnApplicationShutdown
{
  constructor(private configService: ConfigService) {}
  private readonly kafka = new Kafka({
    brokers: this.configService.get('kafka.BROKERS').split(','),
  });
  private readonly producer: Producer = this.kafka.producer();
  async onModuleInit() {
    await this.producer.connect();
  }
  async produce(message: any) {
    const prefix = this.configService.get('kafka.PREFIX');
    const topic = this.configService.get('kafka.PRODUCT_ACTIVITY_LOG');
    await this.producer.send({
      topic: `${prefix}-${topic}`,
      acks: 1,
      messages: [
        {
          key: uuidv4(),
          value: JSON.stringify(message),
        },
      ],
    });
  }
  async onApplicationShutdown() {
    await this.producer.disconnect();
  }
}
