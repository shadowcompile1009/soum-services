import { registerAs } from '@nestjs/config';

export default registerAs('penaltySettings', () => ({
  settings: process.env.PENALTY_SETTINGS,
}));
