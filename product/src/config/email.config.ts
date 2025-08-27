import { registerAs } from '@nestjs/config';

export default registerAs('email', () => ({
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  SENDGRID_SENDER: process.env.SENDGRID_SENDER,
  SENDGRID_TO: process.env.SENDGRID_TO,
  SENDGRID_CC: process.env.SENDGRID_CC,
}));
