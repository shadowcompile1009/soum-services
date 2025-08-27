import { registerAs } from '@nestjs/config';

export default registerAs('prompter', () => ({
  PROMPT_API_KEY: process.env.GEMINI_API_KEY,
  PROMPT_MODEL: process.env.GEMINI_PROMPT_MODEL,
}));
