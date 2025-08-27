import { createHash } from 'crypto';

export const generate256Hash = (data: string): string => {
  return createHash('sha256').update(data).digest('hex');
};
