import { registerAs } from '@nestjs/config';

export default registerAs('bidSettings', () => ({
  settings: process.env.BID_SETTINGS,
}));
