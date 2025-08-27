/* eslint-disable prettier/prettier */
import { registerAs } from '@nestjs/config';

export default registerAs('kafka', () => ({
  BROKERS: process.env.KAFKA_BROKERS,
  PREFIX: process.env.PREFIX,
  TOPIC: process.env.TOPIC_CREATE_NOTIFICATION,
  GROUP: process.env.GROUP_ID
}));
