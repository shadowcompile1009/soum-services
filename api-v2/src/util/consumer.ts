import {
  Consumer,
  ConsumerRunConfig,
  ConsumerSubscribeTopics,
  Kafka,
} from 'kafkajs';
import { Service } from 'typedi';
@Service()
export class ConditionConsumerService {
  private readonly consumers: Consumer[] = [];
  async consume(
    topic: ConsumerSubscribeTopics,
    config: ConsumerRunConfig,
    categoryKafkaConfig: { [key: string]: string }
  ) {
    const kafka = new Kafka({
      brokers: categoryKafkaConfig.kafka_brokers.split(','),
      // ssl: this.configService.get('kafka.TLS_ENABLED')
    });
    const consumer = kafka.consumer({
      groupId: categoryKafkaConfig.prefix + '-condition-activity-log',
    });
    await consumer.connect();
    await consumer.subscribe(topic);
    await consumer.run(config);
    this.consumers.push(consumer);
  }
}

@Service()
export class ProductConsumerService {
  private readonly consumers: Consumer[] = [];
  async consume(
    topic: ConsumerSubscribeTopics,
    config: ConsumerRunConfig,
    productKafkaConfig: { [key: string]: string }
  ) {
    const kafka = new Kafka({
      brokers: productKafkaConfig.kafka_brokers.split(','),
      // ssl: this.configService.get('kafka.TLS_ENABLED')
    });
    const consumer = kafka.consumer({
      groupId: 'product-activity-log' + '-' + productKafkaConfig.prefix,
    });
    await consumer.connect();
    await consumer.subscribe(topic);
    await consumer.run(config);
    this.consumers.push(consumer);
  }
}

@Service()
export class TorodConsumerService {
  private readonly consumers: Consumer[] = [];
  async consume(
    topic: ConsumerSubscribeTopics,
    config: ConsumerRunConfig,
    productKafkaConfig: { [key: string]: string }
  ) {
    const kafka = new Kafka({
      brokers: productKafkaConfig.kafka_brokers.split(','),
      // ssl: this.configService.get('kafka.TLS_ENABLED')
    });
    const consumer = kafka.consumer({
      groupId: 'torod-activity-log' + '-' + productKafkaConfig.prefix,
    });
    await consumer.connect();
    await consumer.subscribe(topic);
    await consumer.run(config);
    this.consumers.push(consumer);
  }
}
