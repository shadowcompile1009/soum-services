import { registerAs } from '@nestjs/config';

export default registerAs('notification', () => ({
  brokers: process.env.KAFKA_BROKERS,
  prefix: process.env.PREFIX,
  topic: process.env.KAFKA_TOPIC_CREATE_NOTIFICATION_LOG,
}));
