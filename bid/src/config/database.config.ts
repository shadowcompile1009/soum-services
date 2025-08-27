import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  URI: process.env.DATABASE_URL,
}));
