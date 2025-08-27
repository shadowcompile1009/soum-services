import { registerAs } from '@nestjs/config';

export default registerAs('typesense', () => ({
  TYPESENSE_HOST: process.env.TYPESENSE_HOST,
  TYPESENSE_PORT: process.env.TYPESENSE_PORT,
  TYPESENSE_PROTOCOL: process.env.TYPESENSE_PROTOCOL,
  TYPESENSE_API_KEY: process.env.TYPESENSE_API_KEY,
}));
