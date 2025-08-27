import { registerAs } from '@nestjs/config';

export default registerAs('commissionActivityLog', () => ({
  kafka_brokers: process.env.KAFKA_BROKERS,
  prefix: process.env.PREFIX,
  commission_activity_kafka_topic:
    process.env.KAFKA_TOPIC_COMMISSION_ACTIVITY_LOG,
}));
