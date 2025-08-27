import { registerAs } from '@nestjs/config';

export default registerAs('kafka', () => ({
  BROKERS: process.env.KAFKA_BROKERS,
  PREFIX: process.env.PREFIX || 'staging-sa',
  TOPIC_SYNC_PRODUCTS: process.env.TOPIC_SYNC_PRODUCTS,
  SEARCH_GROUP_ID: process.env.SEARCH_GROUP_ID,
  TLS_ENABLED: process.env.KAFKA_BROKERS_TLS_ENABLED,
}));
