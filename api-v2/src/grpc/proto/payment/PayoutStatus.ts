// Original file: node_modules/soum-proto/proto/payment.proto

export const PayoutStatus = {
  COMPLETED: 'COMPLETED',
  PROCESSING: 'PROCESSING',
  FAILED: 'FAILED',
  ERROR: 'ERROR',
} as const;

export type PayoutStatus =
  | 'COMPLETED'
  | 0
  | 'PROCESSING'
  | 1
  | 'FAILED'
  | 2
  | 'ERROR'
  | 3;

export type PayoutStatus__Output =
  typeof PayoutStatus[keyof typeof PayoutStatus];
