import { registerAs } from '@nestjs/config';

export default registerAs('kafka', () => ({
  BROKERS: process.env.KAFKA_BROKERS,
  PREFIX: process.env.PREFIX || 'staging-sa',
  TOROD_WEBHOOK_LOG: process.env.TOROD_WEBHOOK_LOG,
}));
