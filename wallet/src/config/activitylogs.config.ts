import { registerAs } from '@nestjs/config';

export default registerAs('activitylog', () => ({
  kafka_brokers: process.env.KAFKA_BROKERS,
  prefix: process.env.PREFIX,
  kafka_topic: process.env.KAFKA_TOPIC_CREATE_ACTIVITY_LOG,
}));
