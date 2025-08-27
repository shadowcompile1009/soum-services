import { registerAs } from '@nestjs/config';

export default registerAs('hyperpay', () => ({
  splitUrl: process.env.HYPER_PAY_SPLIT_URL,
  splitEmail: process.env.HYPER_PAY_SPLIT_EMAIL,
  splitPass: process.env.HYPER_PAY_SPLIT_PASS,
  splitConfigId: process.env.HYPER_PAY_SPLIT_CONFIG_ID,

  httpTimeout: 5000,
}));
