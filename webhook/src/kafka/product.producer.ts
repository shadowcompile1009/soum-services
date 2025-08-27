import {
  Injectable,
  OnModuleInit,
  OnApplicationShutdown,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Kafka, Producer } from 'kafkajs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TorodProducerService
  implements OnModuleInit, OnApplicationShutdown
{
  constructor(private configService: ConfigService) {}
  private readonly kafka = new Kafka({
    brokers: this.configService.get('kafka.BROKERS')?.split(','),
  });
  private readonly producer: Producer = this.kafka.producer();
  async onModuleInit() {
    await this.producer.connect();
  }
  async produce(message: any) {
    const prefix = this.configService.get('kafka.PREFIX');

    let topic = this.configService.get('kafka.TOROD_WEBHOOK_LOG');
    if (process.env.NODE_ENV?.includes('production')) {
      topic = `${prefix}-${topic}`;
    }
    await this.producer.send({
      topic,
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
