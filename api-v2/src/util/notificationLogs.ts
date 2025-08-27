import config from 'config';
import { Kafka, Producer } from 'kafkajs';
import logger from '../util/logger';

const activityLogConfig: { [key: string]: string } = config.get('activitylog');
export interface NotificationRequestEvent {
  eventType: string;
  userId: string;
  service: string;
  messageTitle: string;
  messageBody: string;
  platform: string;
  isRead: boolean;
}
export async function createNotificationEvent(
  eventLog: NotificationRequestEvent
): Promise<void> {
  try {
    const prefix = config.has('activitylog.prefix')
      ? activityLogConfig.prefix
      : '';
    const kafka = new Kafka({
      brokers: activityLogConfig.kafka_brokers.split(','),
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
  } catch (exception) {
    logger.error(exception);
  }
}
