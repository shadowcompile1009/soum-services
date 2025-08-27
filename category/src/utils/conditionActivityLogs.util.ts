import { Kafka, Producer } from 'kafkajs';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
import { ConditionDto } from '@src/modules/condition/dto/condition.dto';
export enum ActionType {
  CREATED = 'Created',
  ACTIVATED = 'Activated',
  INACTIVATED = 'InActivated',
  DELETED = 'Deleted',
  UPDATED = 'Updated',
}

export interface ConditionEventLogRequest {
  actionType: ActionType;
  condition: ConditionDto;
}

export async function createEventLog(
  eventLog: ConditionEventLogRequest,
): Promise<void> {
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const prefix = configService.get('kafka.prefix');
    console.log(configService, configService.get('kafka.kafka_brokers'));
    const kafka = new Kafka({
      brokers: configService.get('kafka.kafka_brokers')?.split(','),
    });
    console.log('Adding new event');
    const producer: Producer = kafka.producer();
    await producer.connect();
    const result = await producer.send({
      topic: `${prefix}-${configService.get(
        'kafka.condition_activity_kafka_topic',
      )}`,
      acks: 1,
      messages: [
        {
          key: uuidv4(),
          value: JSON.stringify(eventLog),
        },
      ],
    });
    console.log(result);
    await producer.disconnect();
  } catch (error) {
    console.log(`there was error while send kafka message with ${error}`);
  }
}
