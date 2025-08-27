/* eslint-disable prettier/prettier */
import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  Kafka,
  Consumer,
  ConsumerSubscribeTopics,
  ConsumerRunConfig,
} from 'kafkajs';
@Injectable()
export class ConsumerService implements OnApplicationShutdown {
  constructor(private configService: ConfigService) {}
  private readonly kafka = new Kafka({
    brokers: this.configService.get('kafka.BROKERS').split(','),
  });
  private readonly consumers: Consumer[] = [];
  async consume(
    topic: ConsumerSubscribeTopics,
    config: ConsumerRunConfig,
    groupId: string,
  ) {
    const consumer = this.kafka.consumer({
      groupId: groupId + '-' + this.configService.get('kafka.PREFIX'),
    });
    await consumer.connect();
    await consumer.subscribe(topic);
    await consumer.run(config);
    this.consumers.push(consumer);
  }
  async onApplicationShutdown() {
    for (const consumer of this.consumers) {
      await consumer.disconnect();
    }
  }
}
