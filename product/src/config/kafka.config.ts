import { registerAs } from '@nestjs/config';

export default registerAs('kafka', () => ({
  BROKERS: process.env.KAFKA_BROKERS,
  PREFIX: process.env.PREFIX || 'staging-sa',
  TOPIC_PRODUCT_VIEW: process.env.TOPIC_PRODUCT_VIEW,
  PRODUCT_GROUP_ID: process.env.PRODUCT_GROUP_ID,
  TLS_ENABLED: process.env.KAFKA_BROKERS_TLS_ENABLED,
  PRODUCT_ACTIVITY_LOG: process.env.TOPIC_PRODUCT_ACTIVITY_LOG,
  NOTIFICATION_WEBENGAGE: process.env.TOPIC_NOTIFICATION_WEBENGAGE,
}));
