import { registerAs } from '@nestjs/config';

export default registerAs('cancellationFeeSettings', () => ({
  settings: process.env.CANCELLATION_FEE_SETTINGS,
}));
