import { registerAs } from '@nestjs/config';

export default registerAs('redis', () => ({
  URL: process.env.REDIS_URL,
}));
