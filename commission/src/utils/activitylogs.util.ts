import { Kafka, Producer } from 'kafkajs';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/app.module';
export enum ActionType {
  CREATED = 'Created',
  ACTIVATED = 'Activated',
  INACTIVATED = 'InActivated',
  DELETED = 'Deleted',
  UPDATED = 'Updated',
}
export interface EventLogRequest {
  module: string;
}

export interface CommissionEventLogRequest extends EventLogRequest {
  actionType: ActionType;
  commissionModuleType: string;
  commissionName: string;
  actionDate: string;
  userName: string;
}

export async function createEventLog(eventLog: EventLogRequest): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const prefix = configService.get('commissionActivityLog.prefix');
  const kafka = new Kafka({
    brokers: configService
      .get('commissionActivityLog.kafka_brokers')
      .split(','),
  });
  const producer: Producer = kafka.producer();
  await producer.connect();
  const result = await producer.send({
    topic: `${prefix}-${configService.get(
      'commissionActivityLog.commission_activity_kafka_topic',
    )}`,
    acks: 1,
    messages: [
      {
        key: uuidv4(),
        value: JSON.stringify(eventLog),
      },
    ],
  });
  await producer.disconnect();
}
