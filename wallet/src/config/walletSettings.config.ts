import { registerAs } from '@nestjs/config';

export default registerAs('walletSettings', () => ({
  settings: process.env.WALLET_SETTINGS,
  config: process.env.WALLET_SETTINGS_CONFIG,
}));
