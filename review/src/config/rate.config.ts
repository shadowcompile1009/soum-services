import { registerAs } from '@nestjs/config';

export default registerAs('rateConfig', () => ({
  config: process.env.rateConfig,
}));
