import { registerAs } from '@nestjs/config';

export default registerAs('kafka', () => ({
  kafka_brokers: process.env.KAFKA_BROKERS,
  prefix: process.env.PREFIX,
  condition_activity_kafka_topic:
    process.env.KAFKA_TOPIC_CONDITION_ACTIVITY_LOG,
  category_activity_kafka_topic: process.env.KAFKA_TOPIC_CATEGORY_ACTIVITY_LOG,
}));
