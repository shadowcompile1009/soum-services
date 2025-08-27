// @ts-nocheck
import { Document, model, Model, Schema } from 'mongoose';

export interface IPaymentLogs extends Document {
  data: string;
  order: string;
  created_at: Date;
  updated_at: Date;
}

const paymentLogsSchema: Schema = new Schema({
  data: {
    type: String,
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'orders',
  },
  created_at: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
  updated_at: {
    type: Date,
    default: () => {
      return new Date();
    },
  },
});

export const PaymentLogs: Model<IPaymentLogs> = model<IPaymentLogs>(
  'paymentLogs',
  paymentLogsSchema,
  'paymentLogs'
);
