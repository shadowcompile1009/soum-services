// @ts-nocheck
import { Document, model, Schema } from 'mongoose';
export type SignupWaitListDocument = Document & {
  mobile_number: string;
  created_date: Date;
  deleted_date: Date;
};

const waitlistSchema = new Schema<SignupWaitListDocument>(
  {
    mobile_number: { type: String, unique: true },
    created_date: { type: Date, default: Date.now() },
    deleted_date: { type: Date, default: null },
  },
  {
    collection: 'SignupWaitList',
  }
);

export const SignupWaitList = model<SignupWaitListDocument>(
  'SignupWaitList',
  waitlistSchema,
  'SignupWaitList'
);
