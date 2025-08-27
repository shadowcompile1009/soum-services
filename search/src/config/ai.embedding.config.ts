import { registerAs } from '@nestjs/config';

export default registerAs('embedding', () => ({
  EMBEDDING_API_KEY: process.env.GEMINI_API_KEY,
  EMBEDDING_MODEL: process.env.GEMINI_EMBEDDING_MODEL,
}));
